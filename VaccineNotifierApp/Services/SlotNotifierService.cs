using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using VaccineNotifierApp.Data;
using VaccineNotifierApp.Models;
using Microsoft.Extensions.Logging;
using VaccineNotifierApp.Infrastructure;
using Microsoft.Extensions.Configuration;
using AutoMapper;
using VaccineNotifierApp.Data.Models;

namespace VaccineNotifierApp.Services
{
    public class SlotNotifierService : ISlotNotifierService
    {
        private AppDbContext _dbContext;
        private ILogger _logger;
        private ITemplateHelper _templateHelper;
        private IEmailService _emailService;
        private IConfiguration _configuration;
        private readonly IMapper _mapper;
        public SlotNotifierService(AppDbContext dbContext, ILogger<SlotNotifierService> logger, ITemplateHelper templateHelper, IEmailService emailService, IConfiguration configuration, IMapper mapper)
        {
            _dbContext = dbContext;
            _logger = logger;
            _templateHelper = templateHelper;
            _emailService = emailService;
            _configuration = configuration;
            _mapper = mapper;
        }

        public bool AddUpdateSlotNotifier(VaccineNotifierModel vaccineNotifierModel)
        {
            try
            {
                var vaccineSlotBooking = _dbContext.VaccineSlotNotifiers.FirstOrDefault(x => x.Email == vaccineNotifierModel.Email);
                if (vaccineSlotBooking != null)
                {
                   _mapper.Map(vaccineNotifierModel, vaccineSlotBooking);
                }
                else
                {
                    var vaccineNotifierDto = _mapper.Map<VaccineSlotNotifier>(vaccineNotifierModel);
                    _dbContext.VaccineSlotNotifiers.Add(vaccineNotifierDto);
                }
                _dbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                _logger.LogError("Not able to subscribe for email", ex);
            }
            return true;
        }

        public async Task CheckSlotAvailability()
        {
            try
            {
                List<int> districtIds = _dbContext.VaccineSlotNotifiers.Select(n => n.DistrictId).Distinct().ToList();

                if (districtIds?.Count > 0)
                {
                    foreach (var district in districtIds)
                    {
                        HttpClient client = new HttpClient();
                        var result = await client.GetAsync($"{_configuration["SlotNotificationUrl"]}?district_id={district}&date={DateTime.Now:dd-MM-yyyy}");
                        if (result.IsSuccessStatusCode)
                        {
                            var responseModel = result.Content.ReadAsAsync<VaccineSlotsResponseModel>();
                            if (responseModel != null && responseModel.Result != null && responseModel.Result.Centers?.Count > 0)
                            {
                                var centers = responseModel.Result.Centers.Where(item => item.Sessions.Any(item2 => item2.AvailableCapacity > 0)).ToList();
                                if (centers?.Count > 0)
                                {
                                    var emails = _dbContext.VaccineSlotNotifiers.Where(_ => _.DistrictId == district && _.Subscribe45PlusNotifier).Select(_ => _.Email).ToList();
                                    if (emails?.Count > 0)
                                    {
                                        var eldergroupCenters = centers.Where(item => item.Sessions.Where(_ => _.AvailableCapacity > 0 && _.MinAgeLimit >= 45).Count() > 0).ToList();
                                        responseModel.Result.Centers = eldergroupCenters;
                                        var htmlBody = _templateHelper.GetTemplateHtmlAsStringAsync("Templates/Email", responseModel.Result);
                                        _emailService.SendEmail(htmlBody.Result, emails);
                                    }
                                    var youngGroupCenters = centers.Where(item => item.Sessions.Where(_ => _.AvailableCapacity > 0 && _.MinAgeLimit >= 18 && _.MinAgeLimit < 45).Count() > 0).ToList();
                                    if (youngGroupCenters?.Count > 0)
                                    {
                                        var emailgroup = _dbContext.VaccineSlotNotifiers.Where(_ => _.DistrictId == district && _.Subscribe18PlusNotifier).Select(_ => _.Email).ToList();
                                        var htmlBody = _templateHelper.GetTemplateHtmlAsStringAsync("Templates/Email", responseModel.Result);
                                        _emailService.SendEmail(htmlBody.Result, emails);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Error logged while checking slots", ex);
            }
        }

        public bool UnsubscribeUser(string email)
        {
            var user = _dbContext.VaccineSlotNotifiers.FirstOrDefault(x => x.Email.ToLower().Equals(email.ToLower()));
            if (user != null)
            {
                _dbContext.VaccineSlotNotifiers.Remove(user);
                _dbContext.SaveChanges();
            }
            else
                return false;
            return true;
        }
    }


}
