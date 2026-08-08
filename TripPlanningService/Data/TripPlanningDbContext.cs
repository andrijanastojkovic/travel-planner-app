using Microsoft.EntityFrameworkCore;
using TripPlanningService.Models;

namespace TripPlanningService.Data
{
    public class TripPlanningDbContext : DbContext
    {
        public TripPlanningDbContext(DbContextOptions<TripPlanningDbContext> options) : base(options) { }

        public DbSet<TripPlan> TripPlans { get; set; }
        public DbSet<Destination> Destinations { get; set; }
        public DbSet<DayActivity> Activities { get; set; }
        public DbSet<ChecklistItem> ChecklistItems { get; set; }
        public DbSet<ShareToken> ShareTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TripPlan>()
                .HasMany(t => t.Destinations)
                .WithOne(d => d.TripPlan)
                .HasForeignKey(d => d.TripPlanId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TripPlan>()
                .HasMany(t => t.Activities)
                .WithOne(a => a.TripPlan)
                .HasForeignKey(a => a.TripPlanId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TripPlan>()
                .HasMany(t => t.ChecklistItems)
                .WithOne(c => c.TripPlan)
                .HasForeignKey(c => c.TripPlanId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TripPlan>()
                .HasMany(t => t.ShareTokens)
                .WithOne(s => s.TripPlan)
                .HasForeignKey(s => s.TripPlanId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DayActivity>()
                .Property(a => a.EstimatedCost)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<TripPlan>()
                .Property(t => t.Budget)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<ShareToken>()
                .HasIndex(s => s.Token)
                .IsUnique();
        }
    }
}
