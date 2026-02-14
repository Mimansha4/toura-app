import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScamMapComponent } from './scam-map';
import { provideHttpClient } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';

describe('ScamMapComponent', () => {

  let component: ScamMapComponent;
  let fixture: ComponentFixture<ScamMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScamMapComponent],   // standalone component
      providers: [
        provideHttpClient(),
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ScamMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

