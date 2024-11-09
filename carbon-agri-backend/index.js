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

// Create a model from the schema
const Data = mongoose.model('carbon_data', DataSchema);

// API endpoint to fetch records based on Date and Farm
app.get('/api/carbon_data', async (req, res) => {
  const { date, farm } = req.query;

  // Validate query parameters
  if (!date || !farm) {
    return res.status(400).json({ message: 'Date and Farm query parameters are required' });
  }

  try {
    const data = await Data.find({
      Date: date,  // Convert date string to Date object
      Farm: farm
    });

    if (data.length === 0) {
      return res.status(404).json({ message: 'No data found for the specified date and farm' });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Set the server to listen on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


