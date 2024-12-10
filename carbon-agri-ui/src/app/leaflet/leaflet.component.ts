import {Component, OnInit} from '@angular/core';
import * as leaflet from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import HeatmapOverlay from 'leaflet-heatmap/leaflet-heatmap.js'
import { Agrifarms } from '../agrifarms';
import { AgrifarmsService } from '../agrifarms.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { icon, Marker } from 'leaflet';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
Marker.prototype.options.icon = iconDefault;


interface Farm{
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-leaflet',
  standalone: true,
  imports:[LeafletModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, FormsModule, CommonModule],
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.scss']
})
export class LeafletComponent implements OnInit {
  private map: any;
  private heatmapLayer: any;
  farm: string = 'Oklahoma';
  dateData: string = '2016-06-25'
  heatData:any;
  agrifarms:Agrifarms[]=[];
  totalcarbon:number=0;
  selectedDate: string = '2016-06-25';
  

  constructor(private agrifarmsService:AgrifarmsService){}
  farms: Farm[] = [
    {value: 'Oklahoma', viewValue: 'Oklahoma'},
    {value: 'Missouri_BAU', viewValue: 'Missouri BAU'},
    {value: 'Missouri_ASP', viewValue: 'Missouri ASP'},
    {value: 'Nebraska_I_M', viewValue: 'Nebraska IM'},
    {value: 'Nebraska_I_M_S', viewValue: 'Nebraska IMS'},
    {value: 'Nebraska_R_M_S', viewValue: 'Nebraska RMS'},
  ];

  selectedFarm = this.farms[0].value;


  loadCarbonData(date: Date | string, farm: string) {
    // Format the date to 'YYYY-MM-DD'
    let formattedDate: string = '';
    if (typeof date === 'string') {
      formattedDate = new Date(date).toISOString().split('T')[0]; // Handles string input
    } else if (date instanceof Date) {
      formattedDate = date.toISOString().split('T')[0]; // Handles Date object
    }
  
    this.agrifarmsService.fetchAllDataForAFarm(farm, formattedDate).subscribe(data => {
      this.agrifarms=data;
      // Calculate total Npp
      const totalNpp = this.agrifarms.reduce((sum, farm) => sum + (farm.Npp || 0), 0);
      const validNppCount = this.agrifarms.filter(farm => farm.Npp != null && !isNaN(farm.Npp)).length;
      const meanNpp = validNppCount > 0 ? (totalNpp / validNppCount) : 0;
      // Convert total Npp (kgC/m2) to total carbon (kgCO2)
      this.totalcarbon = meanNpp * 10000; // Assuming 1 m^2 area per Npp value converted to hectares

      console.log(`Total Carbon Emission (kgC): ${this.totalcarbon}`);

       this.heatData = {
        max: 10,
        data: this.agrifarms.map(farm => ({
          lat: farm.latitude,
          lng: farm.longitude,
          count: farm.Npp // Extract Npp (Net Primary Production) value
        }))
      };
    
      // Update map center based on the first farm's latitude and longitude
      if (this.agrifarms.length > 0) {
        const centerLat = this.agrifarms[0].latitude;
        const centerLng = this.agrifarms[0].longitude;
        this.map.setView([centerLat, centerLng], 16); // Dynamically set the center based on farm

        // Update heatmap layer data
        this.heatmapLayer.setData(this.heatData);
        // Add markers with popups
        this.addPopupsToMap();
      }
    });
    
  }
  ngOnInit(): void {
    this.initMap();
    this.addLegend(); // Add legend to the map
    
  }

  private addLegend(): void {
    const legend = new leaflet.Control({ position: 'bottomright' });
  
    legend.onAdd = () => {
      const div = leaflet.DomUtil.create('div', 'info legend');
      const labels = ['Low', 'Medium', 'High']; // Labels for the colors
      const colors = ['green', 'yellow', 'red']; // Green for low, yellow for medium, red for high
  
      div.innerHTML = '<h6> </h6>';
      // Loop through the labels and colors to generate legend items
      for (let i = 0; i < labels.length; i++) {
        div.innerHTML +=
          `<div style="display: flex; align-items: center; margin-bottom: 4px;">
             <i style="background:${colors[i]}; width: 18px; height: 18px; display: inline-block; margin-right: 8px; border: 1px solid #000;"></i>
             ${labels[i]}
           </div>`;
      }
      return div;
    };
  
    legend.addTo(this.map);
  }
  
  
  

  private initMap(): void {
    // Initialising map with center point by using the coordinates
    // Setting initial zoom to 3
    this.map = leaflet.map('map', {
      center: leaflet.latLng(36.601, -97.492),
      zoom: 3
    });

    // Initialising tiles to the map by using openstreetmap
    // Setting zoom levels
    const tiles = leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      minZoom: 3,
      attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    // Adding tiles to the map
    tiles.addTo(this.map);

    // Setting up heat layer config
    const heatLayerConfig = {
      "radius": 15,
      "maxOpacity": .8,
      "scaleRadius": false,
      // property below is responsible for colorization of heat layer
      "useLocalExtrema": true,
      // here we need to assign property value which represent lat in our data
      latField: 'lat',
      // here we need to assign property value which represent lng in our data
      lngField: 'lng',
      // here we need to assign property value which represent valueField in our data
      valueField: 'count'
    };

    // Initialising heat layer and passing config
     this.heatmapLayer = new HeatmapOverlay(heatLayerConfig);

    
    //Passing data to a layer
    //heatmapLayer.setData(this.heatData);

    //Adding heat layer to a map
    this.heatmapLayer.addTo(this.map);
  }

  // Add popups to each data point
  private addPopupsToMap(): void {
    this.agrifarms.forEach(farm => {
      const marker = leaflet.marker([farm.latitude, farm.longitude]).addTo(this.map);
      marker.setOpacity(0);

      // Bind popup with farm details (e.g., NPP, Lat, Lng)
      marker.bindPopup(
        `<b>Farm: ${this.selectedFarm}</b><br>` +
        `<b>NPP:</b> ${farm.Npp}<br>` +
        `<b>Latitude:</b> ${farm.latitude}<br>` +
        `<b>Longitude:</b> ${farm.longitude}`
      );
    });
  }
}
