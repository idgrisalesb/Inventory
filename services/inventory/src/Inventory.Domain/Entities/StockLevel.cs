using System;

namespace Inventory.Domain.Entities
{
    public class StockLevel
    {
        public Guid WarehouseId { get; set; }
        public Warehouse Warehouse { get; set; } = null!;

        public Guid ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public int Quantity { get; set; }
    }
}
