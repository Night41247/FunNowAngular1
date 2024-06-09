import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformCommentComponent } from './platform-comment.component';

describe('PlatformCommentComponent', () => {
  let component: PlatformCommentComponent;
  let fixture: ComponentFixture<PlatformCommentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlatformCommentComponent]
    });
    fixture = TestBed.createComponent(PlatformCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
