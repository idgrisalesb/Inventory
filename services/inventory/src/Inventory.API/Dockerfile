FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["src/Inventory.API/Inventory.API.csproj", "src/Inventory.API/"]
COPY ["src/Inventory.Application/Inventory.Application.csproj", "src/Inventory.Application/"]
COPY ["src/Inventory.Domain/Inventory.Domain.csproj", "src/Inventory.Domain/"]
COPY ["src/Inventory.Infrastructure/Inventory.Infrastructure.csproj", "src/Inventory.Infrastructure/"]
RUN dotnet restore "src/Inventory.API/Inventory.API.csproj"
COPY . .
WORKDIR "/src/src/Inventory.API"
RUN dotnet build "Inventory.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Inventory.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Inventory.API.dll"]
