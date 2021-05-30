namespace VaccineNotifierApp.Models
{
    public class VaccineNotifierModel
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public bool Subscribe18PlusNotifier { get; set; }
        public bool Subscribe45PlusNotifier { get; set; }
        public bool NotifyMe { get; set; }
        public int StateId { get; set; }
        public int DistrictId { get; set; }
    }
}
