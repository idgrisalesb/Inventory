using Microsoft.AspNetCore.Mvc;
using Inventory.Application.Contracts;
using Inventory.Application.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace Inventory.API.Controllers;

[Authorize(Policy = "InventoryManager")]
[ApiController]
[Route("api/v1/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _service;

    public DashboardController(IDashboardService service)
    {
        _service = service;
    }

    [HttpGet("kpis")]
    public async Task<ActionResult<DashboardKpiDto>> GetKpis()
    {
        var result = await _service.GetKpisAsync();
        return Ok(result);
    }

    [HttpGet("charts")]
    public async Task<ActionResult<List<DashboardChartDto>>> GetCharts()
    {
        var result = await _service.GetStockValueByCategoryAsync();
        return Ok(result);
    }

    [HttpGet("alerts")]
    public async Task<ActionResult<List<DashboardAlertDto>>> GetLowStockAlerts()
    {
        var result = await _service.GetLowStockAlertsAsync();
        return Ok(result);
    }
}
