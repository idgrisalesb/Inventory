using System;
using System.Collections.Generic;

namespace Inventory.Domain.Entities
{
    public class Warehouse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;

        // Navigation property
        public ICollection<StockLevel> StockLevels { get; set; } = new List<StockLevel>();
    }
}
