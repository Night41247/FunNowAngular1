import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgbackMemberComponent } from './pgback-member.component';

describe('PgbackMemberComponent', () => {
  let component: PgbackMemberComponent;
  let fixture: ComponentFixture<PgbackMemberComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PgbackMemberComponent]
    });
    fixture = TestBed.createComponent(PgbackMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
