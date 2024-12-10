const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create an instance of Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());


// MongoDB Connection URI (replace with your MongoDB URI)
mongoose.connect('mongodb://localhost:27017/agriculture_db')
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log('MongoDB connection error:', err));

// Define the Mongoose schema based on your sample data
const DataSchema = new mongoose.Schema({
  Date: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  geo: { type: String, required: true },
  GPP: { type: Number, required: true },
  NDVI: { type: Number, required: true },
  NPPy: { type: Number, required: true },
  Npp: { type: Number, required: true },
  Humidity: { type: Number, required: true },
  SoilTemperature: { type: Number, required: true },
  WindSpeed: { type: Number, required: true },
  WindDirection: { type: Number, required: true },
  AtmosphericPressure: { type: Number, required: true },
  RelativeHumidity: { type: Number, required: true },
  Precipitation: { type: Number, required: true },
  Farm: { type: String, required: true }
}, { collection: 'carbon_data' });

const GroundDataSchema = new mongoose.Schema({
  season: { type: String, required: true },
  precipitation: { type: Number, required: true },
  Longwave_in: { type: Number, required: true },
  GPP_kg_m2_hr: { type: Number, required: true },
  Soil_temperature: { type: Number, required: true },
  NEE_kgC_m2_hr: { type: Number, required: true },
  "Wind Direction": { type: Number, required: true },
  Latent_heat: { type: Number, required: true },
  TIMESTAMP: { type: String, required: true },
  Shortwave_in: { type: Number, required: true },
  RECO_kg_m2_hr: { type: Number, required: true },
  "Soil heat flux": { type: Number, required: true },
  longwave_out: { type: Number, required: true },
  "Soil water content": { type: Number, required: true },
  shortwave_out: { type: Number, required: true },
  netradiation: { type: Number, required: true },
  Farm: { type: String, required: true },
  "Air temperature": { type: Number, required: true },
  Humidity: { type: Number, required: true },
  "Photosynthetic photon flux density out": { type: Number, required: true },
  Wind_speed: { type: Number, required: true },
  Relative_Humidity: { type: Number, required: true },
  "Photosynthetic photon flux density in": { type: Number, required: true },
  CO2_conc: { type: Number, required: true },
  crop_type: {type: String, required: true}
}, { collection: 'ground_carbon_data' });

// Create a model from the schema
const Data = mongoose.model('carbon_data', DataSchema);
const GroundData = mongoose.model('ground_data', GroundDataSchema);

// API endpoint to fetch records based on Date and Farm
app.get('/api/carbon_data', async (req, res) => {
  const { farm, date } = req.query;

  // Validate query parameters
  if ( !farm) {
    return res.status(400).json({ message: 'Farm query parameter is required' });
  }

  try {
    let data;

    // If date is provided, query by both 'Farm' and 'Date'
    if (date) {
      data = await Data.find({
        Farm: farm,
        Date: date
      });
    } 
    // Otherwise, query by 'Farm' only
    else {
      data = await Data.find({
        Farm: farm
      });
    }

    // Check if data is found
    if (data.length === 0) {
      return res.status(404).json({ message: 'No data found for the specified farm and date (if provided)' });
    }

    // Send the data in response
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add API endpoint for ground_carbon_data
app.get('/api/ground_data', async (req, res) => {
  const { farm, date } = req.query;

  // Validate query parameters
  if (!farm) {
    return res.status(400).json({ message: 'Farm query parameter is required' });
  }

  try {
    let data;

    // If date is provided, query by both 'Farm' and 'Date'
    if (date) {
      data = await GroundData.find({
        Farm: farm,
        Date: date
      });
    } 
    // Otherwise, query by 'Farm' only
    else {
      data = await GroundData.find({
        Farm: farm
      });
    }

    // Check if data is found
    if (data.length === 0) {
      return res.status(404).json({ message: 'No data found for the specified farm and date (if provided)' });
    }

    // Send the data in response
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Set the server to listen on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));