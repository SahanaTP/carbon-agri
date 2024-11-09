//import { Component, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit } from '@angular/core';
// import * as L from 'leaflet';
// import { Observable, Subscriber } from 'rxjs';
// import { environment } from '../../environments/environment';
// import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
// import { Agrifarms } from '../agrifarms';
// import { AgrifarmsService } from '../agrifarms.service';
// import { LeafletModule } from '@asymmetrik/ngx-leaflet';
//import '/Users/sahana/Desktop/carbon_agri/carbon-agri-ui/src/app/leaflet/leaflet-heat.js';

// @Component({
//   selector: 'app-leaflet',
//   standalone: true,
//   imports: [NgbDropdownModule, LeafletModule],
//   templateUrl: './leaflet.component.html',
//   styleUrl: './leaflet.component.scss',
//   schemas: [CUSTOM_ELEMENTS_SCHEMA],  //
// })
// export class LeafletComponent {
//   map: any;
//   farm: string = 'Oklahoma';
//   agrifarms:Agrifarms[]=[];

//   constructor(private agrifarmsService:AgrifarmsService){}


//   options ={ 
//     layers: [
//       L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         maxZoom: 12,
//         attribution: ""
//       })
//     ],
//     zoom: 12,
//     center: L.latLng(36.601, -97.492)
//   };
//     // this.map = L.map("map").setView([36.601, -97.492], 11);

//     // L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     //   attribution:
//     //     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//     // }).addTo(this.map);



//   // Function to handle farm selection from the dropdown
//   onFarmSelect(selectedFarm: string) {
//     this.farm = selectedFarm;  // Update the farm parameter
//     this.loadCarbonData('2016-06-25', this.farm);  // Reload data for the selected farm
//   }

//   onMapReady(map: L.Map) {
//     let newAddressPoints = this.agrifarms.map(function (p) { return [p['latitude'], p['longitude']]; });
//     const heat = L.heatLayer(newAddressPoints).addTo(map);
//   }
  
//   loadCarbonData(date: string, farm: string) {
//     this.agrifarmsService.fetchAllDataForAFarm(farm, date).subscribe(data => {
//       this.agrifarms=data;

//       // data.forEach(point => {
//       //  // this.map.flyTo([point.latitude, point.longitude], 13);
//       //   const marker = L.marker([point.latitude, point.longitude])
//       //     .addTo(this.map)
//       //     .bindPopup(`<b>Date:</b> ${point.Date}<br><b>NPP Value:</b> ${point.Npp}`)
//       //     .openPopup();
//       // });
//     });
    
//   }
// }

import {Component, OnInit} from '@angular/core';
import * as leaflet from 'leaflet';
import 'heatmap.js';
import { heatData } from './heatData';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import HeatmapOverlay from 'leaflet-heatmap/leaflet-heatmap.js'


//declare const HeatmapOverlay: any;

@Component({
  selector: 'app-leaflet',
  standalone: true,
  imports:[LeafletModule],
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.scss']
})
export class LeafletComponent implements OnInit {
  private map: any;

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // Initialising map with center point by using the coordinates
    // Setting initial zoom to 3
    this.map = leaflet.map('map', {
      center: leaflet.latLng(36.6586, -70.3568),
      zoom: 2
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
      "radius": 5,
      "maxOpacity": .8,
      "scaleRadius": true,
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
    const heatmapLayer = new HeatmapOverlay(heatLayerConfig);

    // var testData = {
    //   max: 8,
    //   data: [{lat: 24.6408, lng:46.7728, count: 3},{lat: 50.75, lng:-1.55, count: 1}]
    // };
    //Passing data to a layer
    heatmapLayer.setData(heatData);

    //Adding heat layer to a map
    heatmapLayer.addTo(this.map);
  }
}
