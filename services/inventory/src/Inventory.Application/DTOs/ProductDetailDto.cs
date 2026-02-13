using System.Text.Json.Serialization;

namespace Inventory.Application.DTOs;

public class ProductDetailDto
{
    public Guid Id { get; set; }
    public string Sku { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int ReorderPoint { get; set; }
    public decimal UnitPrice { get; set; }
    public int TotalCompanyStock { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public ProductStockStatus StockStatus { get; set; }

    public List<WarehouseStockDto> WarehouseStock { get; set; } = new();
}
