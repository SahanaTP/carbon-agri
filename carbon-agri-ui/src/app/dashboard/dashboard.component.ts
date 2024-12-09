import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Agrifarms } from '../agrifarms';
import { AgrifarmsService } from '../agrifarms.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import {Chart, registerables} from 'chart.js'
import { MatSelectModule } from '@angular/material/select';

Chart.register(...registerables)

interface Farm{
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule, MatPaginatorModule, MatSelectModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent {

  
  displayedColumns: string[] = ['Farm', 'Date', 'latitude', 'longitude', 'GPP','NDVI','NPPy','Npp']//,'Humidity','SoilTemperature','WindSpeed','WindDirection','AtmosphericPressure','RelativeHumidity','Precipitation'];
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

datedata:string[]=[];
ndvi:number[]=[];
npp:number[]=[];
avgNppyByYear: { year: string; avgNppy: number }[] = [];
barChart: Chart | undefined; // Instance for the bar chart

chart1: Chart | undefined; // Instance for the first chart
chart2: Chart | undefined; // Instance for the second chart


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
  
  agrifarms:Agrifarms[]=[];
  @ViewChild(MatPaginator) paginator: any;
  @ViewChild('lineGraph') lineGraph: any;
  @ViewChild('lineGraph2') lineGraph2: any; 

  ngAfterViewInit() {
    this.fetchData('Oklahoma');
    // Ensure the paginator and DOM are ready before initializing the chart
    this.dataSource.paginator = this.paginator;
  }

  fetchData(/*date: string,*/farm: string) {
    this.agrifarmsService.fetchAllDataForAFarm(farm/*, date*/).subscribe((data)=>{
      this.agrifarms=data;
      this.dataSource = new MatTableDataSource<Agrifarms>(data);
      this.dataSource.paginator = this.paginator;

      this.datedata = [];
      this.ndvi = [];
      this.npp = [];
      const nppyByYear: { [year: string]: number[] } = {};

      if(this.agrifarms!=null){
        this.agrifarms.map(o=>{
          this.datedata.push(o.Date);
          this.ndvi.push(o.NDVI);
          this.npp.push(o.Npp);
          const year = new Date(o.Date).getFullYear().toString();
        
          if (!nppyByYear[year]) {
          nppyByYear[year] = [];
            }
            nppyByYear[year].push(o.NPPy);
          });

      // Calculate average NPPy for each year
      this.avgNppyByYear = Object.keys(nppyByYear).map((year) => {
        const avgNppy =
          nppyByYear[year].reduce((sum, value) => sum + value, 0) /
          nppyByYear[year].length;
        return { year, avgNppy };
      });
  
        this.Renderlinechart(this.datedata, this.ndvi, 'lineGraph', 'NDVI', 'chart1');
        this.Renderlinechart(this.datedata, this.npp, 'lineGraph2', 'NPP', 'chart2');
        this.RenderBarChart();
        this.RenderScatterPlot();
      }
    })
  }

  Renderlinechart(labelData: any, valuedata: any, chartId: any, label: any, chartInstance: 'chart1' | 'chart2') {
    let chartType: any = 'line';
    this.RenderChart(labelData, valuedata, chartId, chartType, label, chartInstance);
  }
  
  
 RenderChart(labelData: any, valuedata: any, chartId: any, chartType: any, label: any, chartInstance: 'chart1' | 'chart2') {
  const canvas = document.getElementById(chartId) as HTMLCanvasElement;
  if (canvas) {
    // Destroy the specific chart instance if it exists
    if (chartInstance === 'chart1' && this.chart1) {
      this.chart1.destroy();
    } else if (chartInstance === 'chart2' && this.chart2) {
      this.chart2.destroy();
    }

    // Create a new chart and assign it to the correct instance
    const newChart = new Chart(canvas, {
      type: chartType,
      data: {
        labels: labelData,
        datasets: [
          {
            label: label,
            data: valuedata,
            borderColor: '#3e95cd',
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { display: true, title: { display: true, text: 'Date' } },
          y: { display: true, title: { display: true, text: label } },
        },
      },
    });

    // Assign the new chart to the correct chart instance
    if (chartInstance === 'chart1') {
      this.chart1 = newChart;
    } else if (chartInstance === 'chart2') {
      this.chart2 = newChart;
    }
  } else {
    console.error('Canvas element not found!');
  }
}

RenderBarChart() {
  const labels = this.avgNppyByYear.map((item) => item.year);
  const values = this.avgNppyByYear.map((item) => item.avgNppy);

  const canvas = document.getElementById('barGraph') as HTMLCanvasElement;
  if (canvas) {
    if (this.barChart) {
      this.barChart.destroy();
    }

    this.barChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Average NPPy',
            data: values,
            backgroundColor: '#3e95cd', // Bar color
            borderColor: '#3e95cd', // Border color
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { display: true, title: { display: true, text: 'Year' } },
          y: { display: true, title: { display: true, text: 'Average NPPy' } },
        },
      },
    });
  } else {
    console.error('Canvas element for bar chart not found!');
  }
}


scatterChart: Chart | undefined; // Instance for the scatter plot

RenderScatterPlot() {
  const scatterData = this.agrifarms.map((farm) => ({
    x: farm.NDVI,
    y: farm.GPP,
  }));

  const canvas = document.getElementById('scatterGraph') as HTMLCanvasElement;
  if (canvas) {
    if (this.scatterChart) {
      this.scatterChart.destroy(); // Destroy previous chart instance
    }

    this.scatterChart = new Chart(canvas, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'GPP vs NDVI',
            data: scatterData,
            backgroundColor: 'rgba(62, 149, 205, 0.8)', // Point color
            borderColor: 'rgba(62, 149, 205, 1)', // Border color
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: { display: true, text: 'NDVI' },
          },
          y: {
            title: { display: true, text: 'GPP' },
          },
        },
      },
    });
  } else {
    console.error('Canvas element for scatter plot not found!');
  }
}


}

