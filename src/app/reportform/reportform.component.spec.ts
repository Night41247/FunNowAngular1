import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportformComponent } from './reportform.component';

describe('ReportformComponent', () => {
  let component: ReportformComponent;
  let fixture: ComponentFixture<ReportformComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportformComponent]
    });
    fixture = TestBed.createComponent(ReportformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
