import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  teamMembers = [
    { name: 'Ann Maria John', email: 'annmaria.john@sjsu.edu' },
    { name: 'Priyanka Bhyregowda', email: 'priyanka.bhyregowda@sjsu.edu' },
    { name: 'Madhulika Dutta', email: 'madhulika.dutta@sjsu.edu' },
    { name: 'Sahana Thoravalli Prabhuswamy ', email: 'sahana.thoravalliprabhuswamy@sjsu.edu' },
    { name: 'Supriya Vasagiri', email: 'supriya.vasagiri@sjsu.edu' }
  ];

}

