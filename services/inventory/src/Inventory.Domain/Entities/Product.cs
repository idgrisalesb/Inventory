using System;
using System.Collections.Generic;

namespace Inventory.Domain.Entities
{
    public class Product
    {
        public Guid Id { get; set; }
        public string Sku { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int ReorderPoint { get; set; }
        public decimal UnitPrice { get; set; }

        // Navigation property
        public ICollection<StockLevel> StockLevels { get; set; } = new List<StockLevel>();
    }
}
