import { AfterViewInit, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Agrifarms } from '../agrifarms';
import { AgrifarmsService } from '../agrifarms.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent {
  displayedColumns: string[] = ['Farm', 'Date', 'latitude', 'longitude', 'GPP','NDVI','NPPy','Npp','Humidity','SoilTemperature','WindSpeed','WindDirection','AtmosphericPressure','RelativeHumidity','Precipitation'];
  dataSource = new MatTableDataSource<Agrifarms>();
  agrifarm:Agrifarms={
    Date: "2016-01-01",                // Date in string format (e.g., '2016-06-25')
    latitude: 36.2,            // Latitude as a number
    longitude: 95.3,           // Longitude as a number
    geo: "string",                 // Geo JSON as a string
    GPP: 0.45,                 // Gross Primary Production (GPP) as a number
    NDVI: 0.67,                // Normalized Difference Vegetation Index (NDVI) as a number
    NPPy: 0.89,                // Net Primary Productivity (NPPy) as a number
    Npp: 0.89,                // Net Primary Production (Npp) as a number
    Humidity: 0.6,            // Humidity as a number
    SoilTemperature: 10,     // Soil Temperature as a number
    WindSpeed: 5,           // Wind Speed as a number
    WindDirection: 56,       // Wind Direction as a number
    AtmosphericPressure: 46, // Atmospheric Pressure as a number
    RelativeHumidity: 0.8,    // Relative Humidity as a number
    Precipitation: 0.0,       // Precipitation as a number
    Farm: "Oklahoma" 
}

  constructor(private agrifarmsService:AgrifarmsService){}


  
  agrifarms:Agrifarms[]=[];

  fetchData(date: string, farm: string) {
    this.agrifarmsService.fetchAllDataForAFarm(farm, date).subscribe((data)=>{
      this.agrifarms=data;
      this.dataSource = new MatTableDataSource<Agrifarms>(data);
    })
  }
}

