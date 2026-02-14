import {
  Component,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { ScamService, Scam, ScamStats } from '../services/scam.service';

@Component({
  selector: 'app-scam-map',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './scam-map.html',
  styleUrls: ['./scam-map.scss']
})
export class ScamMapComponent implements AfterViewInit, OnDestroy {

  /* =========================
     CORE DATA
  ========================= */

  scams: Scam[] = [];
  topScams: ScamStats[] = [];
  animatedCounts: number[] = [];

  showModal = false;
  reportForm: FormGroup;

  private map: any;
  private L: any;
  private countIntervals: any[] = [];

  userLatitude!: number;
  userLongitude!: number;

  scamTypes: string[] = [
    'PICKPOCKET',
    'FAKE_GUIDE',
    'TAXI_FRAUD',
    'CARD_SKIMMING',
    'OVERCHARGING',
    'OTHER'
  ];

  /* =========================
     SAFETY GUIDE DATA
  ========================= */

  scamGuides = [
    {
      title: '🚨 CARD SKIMMING',
      open: false,
      precautions: [
        'Never swipe card at suspicious machines.',
        'Inspect ATM slot before inserting card.',
        'Cover keypad while entering PIN.',
        'Avoid isolated ATMs.',
        'Enable transaction alerts.',
        'Prefer chip & PIN over magnetic swipe.'
      ],
      actions: [
        'Block card immediately via banking app.',
        'Raise dispute for unauthorized transactions.',
        'Change ATM PIN and online password.',
        'File complaint within 24 hours.',
        'Report to cybercrime portal.'
      ]
    },
    {
      title: '🎒 PICKPOCKET',
      open: false,
      precautions: [
        'Keep wallet in front pocket.',
        'Avoid carrying large cash.',
        'Use anti-theft backpacks.',
        'Avoid stranger distractions.',
        'Keep phone in zipped pocket.'
      ],
      actions: [
        'Block debit/credit cards.',
        'Track phone using Find My Device.',
        'File police complaint.',
        'Inform bank and mobile provider.'
      ]
    },
    {
      title: '🧭 FAKE GUIDE',
      open: false,
      precautions: [
        'Hire guides through official counters.',
        'Check ID badge and license.',
        'Avoid aggressive strangers.',
        'Do not pay full upfront.',
        'Check reviews before booking.'
      ],
      actions: [
        'Stop tour immediately.',
        'Do not pay extra demanded money.',
        'Report to tourism office.',
        'Leave review warning others.'
      ]
    },
    {
      title: '🚕 TAXI FRAUD',
      open: false,
      precautions: [
        'Use app-based taxis.',
        'Confirm fare before ride.',
        'Ensure meter starts at zero.',
        'Share live location.',
        'Avoid roadside taxis.'
      ],
      actions: [
        'Take photo of number plate.',
        'Refuse unreasonable fare.',
        'Report in taxi app.',
        'File complaint with authority.'
      ]
    },
    {
      title: '💰 OVERCHARGING',
      open: false,
      precautions: [
        'Check menu prices before ordering.',
        'Confirm total before buying.',
        'Ask for printed bill.',
        'Be cautious in tourist areas.',
        'Cross-check online prices.'
      ],
      actions: [
        'Ask for price breakdown.',
        'Refuse hidden charges.',
        'Pay digitally for proof.',
        'Report to consumer helpline.'
      ]
    }
  ];

  /* =========================
     CONSTRUCTOR
  ========================= */

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private scamService: ScamService,
    private cdr: ChangeDetectorRef
  ) {

    this.reportForm = this.fb.group({
      type: ['', Validators.required],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10)
        ]
      ]
    });

  }

  /* =========================
     FORM GETTER
  ========================= */

  get f() {
    return this.reportForm.controls;
  }

  /* =========================
     LIFECYCLE
  ========================= */

  async ngAfterViewInit(): Promise<void> {

    if (!isPlatformBrowser(this.platformId)) return;

    this.L = await import('leaflet');

    this.loadTopScams();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.userLatitude = position.coords.latitude;
        this.userLongitude = position.coords.longitude;

        this.initializeMap();
        this.loadScams();
      },
      () => {
        alert("Location permission required.");
      }
    );
  }

  ngOnDestroy(): void {
    this.countIntervals.forEach(i => clearInterval(i));
  }

  /* =========================
     MAP
  ========================= */

  initializeMap() {

    if (this.map) {
      this.map.remove();
    }

    this.map = this.L.map('map')
      .setView([this.userLatitude, this.userLongitude], 13);

    this.L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '&copy; OpenStreetMap contributors' }
    ).addTo(this.map);

    this.L.marker([this.userLatitude, this.userLongitude])
      .addTo(this.map)
      .bindPopup("📍 You are here");

    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
  }

  loadScams() {

    this.scamService.getAllScams().subscribe({

      next: (data: Scam[]) => {

        this.scams = data;

        this.scams.forEach(scam => {

          this.L.circleMarker(
            [scam.latitude, scam.longitude],
            {
              radius: 8,
              color: this.getColor(scam.type),
              fillOpacity: 0.8
            }
          )
          .addTo(this.map)
          .bindPopup(`<b>${scam.type}</b><br>${scam.description}`);
        });
      },

      error: (err: any) => {
        console.error("Error loading scams:", err);
      }
    });
  }

  /* =========================
     TOP SCAMS
  ========================= */

  loadTopScams() {

    this.scamService.getScamStats().subscribe({

      next: (stats: ScamStats[]) => {

        this.topScams = stats
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        this.startCountAnimation();
        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error("Stats error:", err);
      }
    });
  }

  startCountAnimation() {

    this.countIntervals.forEach(i => clearInterval(i));
    this.countIntervals = [];
    this.animatedCounts = [];

    this.topScams.forEach((scam, index) => {

      if (!scam.count || scam.count <= 0) {
        this.animatedCounts[index] = 0;
        return;
      }

      let current = 0;
      const increment = Math.max(1, Math.floor(scam.count / 20));

      const interval = setInterval(() => {

        current += increment;

        if (current >= scam.count) {
          current = scam.count;
          clearInterval(interval);
        }

        this.animatedCounts[index] = current;

      }, 40);

      this.countIntervals.push(interval);
    });
  }

  /* =========================
     GUIDE TOGGLE
  ========================= */

  toggleGuide(index: number) {
    this.scamGuides[index].open = !this.scamGuides[index].open;
  }

  /* =========================
     MODAL
  ========================= */

  openModal(): void {
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.showModal = false;
    this.reportForm.reset();
    document.body.style.overflow = 'auto';
  }

  /* =========================
     SUBMIT
  ========================= */

  submitReport(): void {

    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      return;
    }

    const { type, description } = this.reportForm.value;

    if (type === 'OTHER') {

      this.scamService.classifyScam(description).subscribe({
        next: (response: any) => {
          this.sendToBackend(response.type, description);
        },
        error: () => {
          alert("Could not classify scam.");
        }
      });

    } else {
      this.sendToBackend(type, description);
    }
  }

  sendToBackend(type: string, description: string) {

    const payload: Scam = {
      type,
      description,
      latitude: this.userLatitude,
      longitude: this.userLongitude
    };

    this.scamService.createScam(payload).subscribe({

      next: () => {

        alert("Successfully registered your scam.");

        this.closeModal();
        this.initializeMap();
        this.loadScams();
        this.loadTopScams();
      },

      error: () => {
        alert("Failed to register scam.");
      }
    });
  }

  /* =========================
     HELPER
  ========================= */

  getColor(type: string): string {
    switch (type) {
      case 'PICKPOCKET': return 'red';
      case 'FAKE_GUIDE': return 'orange';
      case 'TAXI_FRAUD': return 'purple';
      case 'CARD_SKIMMING': return 'blue';
      case 'OVERCHARGING': return 'green';
      default: return 'black';
    }
  }
}
