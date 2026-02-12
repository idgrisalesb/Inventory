namespace Inventory.Application.DTOs;

public class WarehouseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public int TotalItems { get; set; }
    public decimal TotalValue { get; set; }
}
