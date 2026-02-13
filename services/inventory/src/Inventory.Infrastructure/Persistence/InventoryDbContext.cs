using Microsoft.EntityFrameworkCore;
using Inventory.Domain.Entities;
using Inventory.Application.Contracts;

namespace Inventory.Infrastructure.Persistence
{
    public class InventoryDbContext : DbContext, IInventoryDbContext
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

            // Indexes for Search Performance
            modelBuilder.Entity<Product>()
                .HasIndex(p => p.Name);

            modelBuilder.Entity<Product>()
                .HasIndex(p => p.Sku);

            base.OnModelCreating(modelBuilder);
        }
    }
}
