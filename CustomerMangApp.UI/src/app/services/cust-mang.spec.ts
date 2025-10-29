import { TestBed } from '@angular/core/testing';

import { CustMang } from './cust-mang';

describe('CustMang', () => {
  let service: CustMang;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustMang);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
