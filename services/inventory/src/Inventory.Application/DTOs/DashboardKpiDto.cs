namespace Inventory.Application.DTOs;

public class DashboardKpiDto
{
    public int TotalSkus { get; set; }
    public decimal TotalStockValue { get; set; }
    public int LowStockCount { get; set; }
    public int OutOfStockCount { get; set; }
}
