using Microsoft.EntityFrameworkCore;
using System;
using VaccineNotifierApp.Data.Models;

namespace VaccineNotifierApp.Data
{
    public interface IAppDbContext 
    {

    }

    public class AppDbContext : DbContext,IAppDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            Database.EnsureCreated();
        }
        public DbSet<VaccineSlotNotifier> VaccineSlotNotifiers { get; set; }
    }
}
