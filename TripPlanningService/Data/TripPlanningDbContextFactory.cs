using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace TripPlanningService.Data
{
    public class TripPlanningDbContextFactory : IDesignTimeDbContextFactory<TripPlanningDbContext>
    {
        public TripPlanningDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<TripPlanningDbContext>();
            optionsBuilder.UseSqlServer(configuration.GetConnectionString("TripPlanningDb"));

            return new TripPlanningDbContext(optionsBuilder.Options);
        }
    }
}
