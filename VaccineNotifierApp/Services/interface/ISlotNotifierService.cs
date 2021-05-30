using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VaccineNotifierApp.Models;

namespace VaccineNotifierApp.Services
{
    public interface ISlotNotifierService
    {
        bool AddUpdateSlotNotifier(VaccineNotifierModel vaccineNotifierModel);

        Task CheckSlotAvailability();

        bool UnsubscribeUser(string emailId);
    }
}
