using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VaccineNotifierApp.Models;
using VaccineNotifierApp.Services;

namespace VaccineNotifierApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SlotBookingController : ControllerBase
    {
        private ISlotNotifierService slotNotifierService; 

        public SlotBookingController(ISlotNotifierService _slotNotifierService)
        {
            slotNotifierService = _slotNotifierService;
        }

        [HttpPost]
        public ActionResult Index(VaccineNotifierModel model)
        {
            slotNotifierService.AddUpdateSlotNotifier(model);  
            return Ok();
        }  

        [HttpDelete]
        [Route("unsubscribeuser/{email}")]
        public ActionResult Delete(string email)
        {

            slotNotifierService.UnsubscribeUser(email);
            return Ok();
        }
    }
}
