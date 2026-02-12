using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Inventory.Domain.Entities;

namespace Inventory.Infrastructure.Persistence
{
    public static class ModelBuilderExtensions
    {
        public static void Seed(this ModelBuilder modelBuilder)
        {
            // Warehouses
            var warehouses = new[]
            {
                new Warehouse { Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), Name = "North Warehouse", Location = "New York, USA" },
                new Warehouse { Id = Guid.Parse("22222222-2222-2222-2222-222222222222"), Name = "South Warehouse", Location = "Miami, USA" },
                new Warehouse { Id = Guid.Parse("33333333-3333-3333-3333-333333333333"), Name = "East Warehouse", Location = "Boston, USA" },
                new Warehouse { Id = Guid.Parse("44444444-4444-4444-4444-444444444444"), Name = "West Warehouse", Location = "San Francisco, USA" },
                new Warehouse { Id = Guid.Parse("55555555-5555-5555-5555-555555555555"), Name = "Central Warehouse", Location = "Chicago, USA" }
            };

            modelBuilder.Entity<Warehouse>().HasData(warehouses);

            // Products (50+)
            var products = new List<Product>();

            for (int i = 1; i <= 50; i++)
            {
                var category = i % 2 == 0 ? "Electronics" : "Mechanical";
                products.Add(new Product
                {
                    Id = Guid.Parse($"00000000-0000-0000-0000-{i:D12}"),
                    Sku = $"SKU-{i:D4}",
                    Name = $"{category} Product {i}",
                    Description = $"Description for product {i}",
                    Category = category,
                    ReorderPoint = 10,
                    UnitPrice = 10.0m + i
                });
            }

            modelBuilder.Entity<Product>().HasData(products);

            // StockLevels
            var stockLevels = new List<StockLevel>();
            foreach(var w in warehouses)
            {
                foreach(var p in products)
                {
                    // Add stock for each product in each warehouse
                    // Deterministic pseudo-randomness
                    int seed = w.Id.GetHashCode() ^ p.Id.GetHashCode();
                    int quantity = Math.Abs(seed % 100) + 20;

                    stockLevels.Add(new StockLevel
                    {
                        WarehouseId = w.Id,
                        ProductId = p.Id,
                        Quantity = quantity
                    });
                }
            }

            modelBuilder.Entity<StockLevel>().HasData(stockLevels);
        }
    }
}
