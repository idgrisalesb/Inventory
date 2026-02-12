namespace Inventory.Application.DTOs;

public class DashboardAlertDto
{
    public Guid ProductId { get; set; }
    public required string ProductName { get; set; }
    public string? Sku { get; set; }
    public int TotalQuantity { get; set; }
    public int ReorderPoint { get; set; }
}
