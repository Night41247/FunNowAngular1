import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelcommentboxComponent } from './hotelcommentbox.component';

describe('HotelcommentboxComponent', () => {
  let component: HotelcommentboxComponent;
  let fixture: ComponentFixture<HotelcommentboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HotelcommentboxComponent]
    });
    fixture = TestBed.createComponent(HotelcommentboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
