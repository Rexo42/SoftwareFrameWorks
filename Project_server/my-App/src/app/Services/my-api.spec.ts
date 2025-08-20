import { TestBed } from '@angular/core/testing';

import { MyApi } from './my-api';

describe('MyApi', () => {
  let service: MyApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
