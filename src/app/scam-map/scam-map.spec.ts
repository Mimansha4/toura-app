import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScamMap } from './scam-map';

describe('ScamMap', () => {
  let component: ScamMap;
  let fixture: ComponentFixture<ScamMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScamMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScamMap);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
