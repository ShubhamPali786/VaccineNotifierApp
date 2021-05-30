using System;
using System.Collections.Generic;
using System.Text;

namespace VaccineNotifierApp.Infrastructure
{
    public interface IEmailService
    {
        void SendEmail(string emailBody, List<string> emailAddresses);
    }
}
