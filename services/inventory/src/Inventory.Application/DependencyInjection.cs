using Microsoft.Extensions.DependencyInjection;
using Inventory.Application.Contracts;
using Inventory.Application.Services;

namespace Inventory.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<IWarehouseService, WarehouseService>();
            return services;
        }
    }
}
