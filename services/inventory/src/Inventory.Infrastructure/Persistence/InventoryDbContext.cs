using Microsoft.EntityFrameworkCore;
using Inventory.Domain.Entities;

namespace Inventory.Infrastructure.Persistence
{
    public class InventoryDbContext : DbContext
    {
        public InventoryDbContext(DbContextOptions<InventoryDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Warehouse> Warehouses { get; set; }
        public DbSet<StockLevel> StockLevels { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Composite key for StockLevel
            modelBuilder.Entity<StockLevel>()
                .HasKey(sl => new { sl.WarehouseId, sl.ProductId });

            // Seed Data
            modelBuilder.Seed();

            base.OnModelCreating(modelBuilder);
        }
    }
}
