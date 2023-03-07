import { TestBed } from '@angular/core/testing';

import { GameRequestService } from './game-request.service';

describe('GameRequestService', () => {
  let service: GameRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
