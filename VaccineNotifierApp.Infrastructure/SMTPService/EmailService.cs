using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace VaccineNotifierApp.Infrastructure
{
    public class EmailService : IEmailService
    {
        private ILogger logger;

        private static string smtpAddress;
        private static int portNumber;
        private static bool enableSSL;
        private static string emailFromAddress; 
        private static string password; 
        private static string subject = "Alert: New vaccine slots available";
        public EmailService(IConfiguration configuration,ILogger<EmailService> logger)
        {
            this.logger = logger;
            smtpAddress = configuration["SmtpSettings:SmtpAddress"];
            portNumber = Convert.ToInt16(configuration["SmtpSettings:PortNumber"]);
            enableSSL = Convert.ToBoolean(configuration["SmtpSettings:EnableSSL"]);
            emailFromAddress = configuration["SmtpSettings:EmailFromAddress"];
            password = configuration["SmtpSettings:Password"];
        }


        public void SendEmail(string emailBody, List<string> emailAddresses)
        {
            try
            {
                using (MailMessage mail = new MailMessage())
                {
                    mail.From = new MailAddress(emailFromAddress);
                    mail.To.AddRange(emailAddresses);
                    mail.Subject = subject;
                    mail.Body = emailBody;
                    mail.IsBodyHtml = true;

                    using (SmtpClient smtp = new SmtpClient(smtpAddress, portNumber))
                    {
                        smtp.Credentials = new NetworkCredential(emailFromAddress, password);
                        smtp.EnableSsl = enableSSL;
                        smtp.Send(mail);
                    }
                }
            }
            catch (Exception ex)
            {
                logger.LogError($"Unable to send email to users: {string.Join(",", emailAddresses)}", ex);
            }
        }
    }

    public static class Extensions
    {
        public static MailAddressCollection AddRange(this MailAddressCollection mail, List<string> emails)
        {
            foreach (var item in emails)
            {
                mail.Add(item);
            }
            return mail;
        }
    }
}
