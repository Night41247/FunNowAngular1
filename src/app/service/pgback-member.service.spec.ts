import { TestBed } from '@angular/core/testing';

import { PgbackMemberService } from './pgback-member.service';

describe('PgbackMemberService', () => {
  let service: PgbackMemberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PgbackMemberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
