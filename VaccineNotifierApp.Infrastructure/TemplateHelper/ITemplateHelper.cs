using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace VaccineNotifierApp.Infrastructure
{
    public interface ITemplateHelper
    {
        Task<string> GetTemplateHtmlAsStringAsync<T>(string viewName, T model);
    }
}
