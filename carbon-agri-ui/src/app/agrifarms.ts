export interface Agrifarms {

    Date: string,                // Date in string format (e.g., '2016-06-25')
    latitude: number,            // Latitude as a number
    longitude: number,           // Longitude as a number
    geo: string,                 // Geo JSON as a string
    GPP: number,                 // Gross Primary Production (GPP) as a number
    NDVI: number,                // Normalized Difference Vegetation Index (NDVI) as a number
    NPPy: number,                // Net Primary Productivity (NPPy) as a number
    Npp: number,                // Net Primary Production (Npp) as a number
    Humidity: number,            // Humidity as a number
    SoilTemperature: number,     // Soil Temperature as a number
    WindSpeed: number,           // Wind Speed as a number
    WindDirection: number,       // Wind Direction as a number
    AtmosphericPressure: number, // Atmospheric Pressure as a number
    RelativeHumidity: number,    // Relative Humidity as a number
    Precipitation: number,       // Precipitation as a number
    Farm: string
}
