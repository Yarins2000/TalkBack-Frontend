import { TestBed } from '@angular/core/testing';

import { ChatSharedDataService } from './chat-shared-data.service';

describe('ChatSharedDataService', () => {
  let service: ChatSharedDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatSharedDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
