import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelCommentComponent } from './hotel-comment.component';

describe('HotelCommentComponent', () => {
  let component: HotelCommentComponent;
  let fixture: ComponentFixture<HotelCommentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HotelCommentComponent]
    });
    fixture = TestBed.createComponent(HotelCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
