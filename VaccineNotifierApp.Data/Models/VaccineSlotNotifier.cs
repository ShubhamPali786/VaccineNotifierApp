using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace VaccineNotifierApp.Data.Models
{
    public class VaccineSlotNotifier
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public bool Subscribe18PlusNotifier { get; set; }
        public bool Subscribe45PlusNotifier { get; set; }
        public bool NotifyMe { get; set; }
        public int DistrictId { get; set; }
    }
}
