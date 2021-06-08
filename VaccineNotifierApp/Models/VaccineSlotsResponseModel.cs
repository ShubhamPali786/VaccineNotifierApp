using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VaccineNotifierApp.Models
{
    public class VaccineSlotsResponseModel
    {
        public List<Center> Centers { get; set; }
        public string MinAgeLimit { get; set; }
    }

    public class Center
    {
        [JsonProperty("state_name")]
        public string StateName { get; set; }
        [JsonProperty("district_name")]
        public string DistrictName { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public int Pincode { get; set; }
        public List<Sessions> Sessions { get; set; }
    }
    public class Sessions
    {
        [JsonProperty("min_age_limit")]
        public int MinAgeLimit { get; set; }
        [JsonProperty("available_capacity_dose1")]
        public int AvailableCapacityForDose1 { get; set; }
        [JsonProperty("available_capacity_dose2")]
        public int AvailableCapacityForDose2 { get; set; }
        public string Date { get; set; }
        [JsonProperty("available_capacity")]
        public int AvailableCapacity { get; set; }
        public string Vaccine { get; set; }
    }
}
