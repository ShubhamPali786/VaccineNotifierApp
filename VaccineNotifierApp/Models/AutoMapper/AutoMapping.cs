using AutoMapper;
using VaccineNotifierApp.Data.Models;

namespace VaccineNotifierApp.Models.AutoMapper
{
    public class AutoMapping : Profile
    {
        public AutoMapping()
        {
            CreateMap<VaccineNotifierModel, VaccineSlotNotifier>();
        }
    }
}
