import { Component } from '@angular/core';
import { LeafletComponent } from '../leaflet/leaflet.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LeafletComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {

}
