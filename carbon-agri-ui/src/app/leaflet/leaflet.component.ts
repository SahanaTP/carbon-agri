import { Component, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit } from '@angular/core';
import L from 'leaflet';
import { Observable, Subscriber } from 'rxjs';
import { environment } from '../../environments/environment';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-leaflet',
  standalone: true,
  imports: [NgbDropdownModule],
  templateUrl: './leaflet.component.html',
  styleUrl: './leaflet.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  //
})
export class LeafletComponent {
  map: any;
  ngOnInit() {
    this.map = L.map("map").setView([46.879966, -121.726909], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }
}
