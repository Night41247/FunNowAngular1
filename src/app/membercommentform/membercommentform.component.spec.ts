import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembercommentformComponent } from './membercommentform.component';

describe('MembercommentformComponent', () => {
  let component: MembercommentformComponent;
  let fixture: ComponentFixture<MembercommentformComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MembercommentformComponent]
    });
    fixture = TestBed.createComponent(MembercommentformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
