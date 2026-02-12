import {
  Component,
  AfterViewInit,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import {
  trigger,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-scam-map',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './scam-map.html',
  styleUrls: ['./scam-map.scss'],
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.85)' }),
        animate(
          '250ms ease-out',
          style({ opacity: 1, transform: 'scale(1)' })
        )
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'scale(0.85)' })
        )
      ])
    ])
  ]
})
export class ScamMapComponent implements AfterViewInit {

  showModal = false;

  scamTypes = [
    'Pickpocket',
    'Fake Guide',
    'Taxi Fraud',
    'Card Skimming',
    'Overcharging',
    'Others'
  ];

  reportForm: FormGroup;

  scams = [
    { id: 1, type: 'Pickpocket', lat: 28.6139, lng: 77.2090 },
    { id: 2, type: 'Fake Guide', lat: 28.6120, lng: 77.2160 },
    { id: 3, type: 'Taxi Fraud', lat: 28.6100, lng: 77.2000 },
    { id: 4, type: 'Card Skimming', lat: 28.6200, lng: 77.2100 },
    { id: 5, type: 'Overcharging', lat: 28.6180, lng: 77.2050 }
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder
  ) {
    this.reportForm = this.fb.group({
      type: ['', Validators.required],
      title: [''],
      description: ['', Validators.required]
    });
  }

  async ngAfterViewInit(): Promise<void> {

    if (isPlatformBrowser(this.platformId)) {

      const L = await import('leaflet');

      const map = L.map('map').setView([28.6139, 77.2090], 13);

      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; OpenStreetMap contributors'
        }
      ).addTo(map);

      this.scams.forEach(scam => {

        let color = 'red';

        switch (scam.type) {
          case 'Pickpocket':
            color = 'red';
            break;
          case 'Fake Guide':
            color = 'orange';
            break;
          case 'Taxi Fraud':
            color = 'purple';
            break;
          case 'Card Skimming':
            color = 'blue';
            break;
          case 'Overcharging':
            color = 'green';
            break;
        }

        const icon = L.divIcon({
          className: '',
          html: `
            <div style="
              width:18px;
              height:18px;
              background:${color};
              border-radius:50%;
              border:3px solid white;
              box-shadow:0 0 12px ${color};
            "></div>
          `,
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        });

        L.marker([scam.lat, scam.lng], { icon })
          .addTo(map)
          .bindPopup(
            `<b>Scam ID:</b> ${scam.id}<br/>
             <b>Type:</b> ${scam.type}`
          );
      });

      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }

  openModal(): void {
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.showModal = false;
    document.body.style.overflow = 'auto';
    this.reportForm.reset();
  }

  submitReport(): void {
    if (this.reportForm.invalid) return;

    console.log('Reported Scam:', this.reportForm.value);
    this.closeModal();
  }

  isOtherSelected(): boolean {
    return this.reportForm.get('type')?.value === 'Others';
  }
}
