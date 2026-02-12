namespace Inventory.Application.DTOs;

public class DashboardChartDto
{
    public required string CategoryName { get; set; }
    public decimal TotalValue { get; set; }
    public decimal Percentage { get; set; }
}
