import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router, RouterLink } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import {NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NgbCollapseModule, RouterLink, LeafletModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'carbon-agri-ui';
  public isCollapsed = true;
}
