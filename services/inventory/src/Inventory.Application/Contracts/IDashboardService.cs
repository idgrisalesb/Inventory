using Inventory.Application.DTOs;

namespace Inventory.Application.Contracts;

public interface IDashboardService
{
    Task<DashboardKpiDto> GetKpisAsync();
    Task<List<DashboardChartDto>> GetStockValueByCategoryAsync();
    Task<List<DashboardAlertDto>> GetLowStockAlertsAsync();
}
