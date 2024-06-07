import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberCommentComponent } from './member-comment.component';

describe('MemberCommentComponent', () => {
  let component: MemberCommentComponent;
  let fixture: ComponentFixture<MemberCommentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MemberCommentComponent]
    });
    fixture = TestBed.createComponent(MemberCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
