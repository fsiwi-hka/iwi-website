FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["IWI-Backend.Api/IWI-Backend.Api.csproj", "IWI-Backend.Api/"]
RUN dotnet restore "IWI-Backend.Api/IWI-Backend.Api.csproj"
COPY . .
WORKDIR "/src/IWI-Backend.Api"
RUN dotnet build "./IWI-Backend.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./IWI-Backend.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Noch als root: Cache-Verzeichnis anlegen und dem App-User geben
RUN mkdir -p /home/app/cache /home/app/state && chown -R $APP_UID:$APP_UID /home/app/

# Erst jetzt auf den non-root User wechseln
USER $APP_UID

ENV ASPNETCORE_URLS=http://+:8080
ENV Sync__CacheDirectory=/home/app/cache

ENTRYPOINT ["dotnet", "IWI-Backend.Api.dll"]