export interface Groundfarms{
    season: string;
    precipitation: number;
    Longwave_in: number;
    GPP_kg_m2_hr: number;
    Soil_temperature: number;
    NEE_kgC_m2_hr: number;
    "Wind Direction": number;
    Latent_heat: number;
    TIMESTAMP: string;
    Shortwave_in: number;
    RECO_kg_m2_hr: number;
    "Soil heat flux": number;
    longwave_out: number;
    "Soil water content": number;
    shortwave_out: number;
    netradiation: number;
    Farm: string;
    "Air temperature": number;
    Humidity: number;
    "Photosynthetic photon flux density out": number;
    Wind_speed: number;
    Relative_Humidity: number;
    "Photosynthetic photon flux density in": number;
    CO2_conc: number;
    croptype: String;
}