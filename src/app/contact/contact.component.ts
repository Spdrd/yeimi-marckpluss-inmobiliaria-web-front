import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

  // 🌟 Contacto
  contactMethods = [
    { icon: 'fas fa-envelope', title: 'Email', value: 'correo@marckpluss.com' },
    { icon: 'fas fa-phone', title: 'Teléfono', value: '+57 555 555 5555' },
    { icon: 'fas fa-map-marker-alt', title: 'Ubicación', value: 'Bogotá, Colombia' },
    { icon: 'fas fa-calendar', title: 'Disponibilidad', value: 'Lun - Vie, 9AM - 6PM' }
  ];

  socialLinks = [
    { icon: 'fab fa-whatsapp', url: '', network: 'social-whatsapp' },
    { icon: 'fab fa-instagram', url: '', network: 'social-instagram' },
    { icon: 'fab fa-tiktok', url: '', network: 'social-tiktok' },
    { icon: 'fas fa-at', url: 'mailto:', network: 'social-email' },
  ];
}
