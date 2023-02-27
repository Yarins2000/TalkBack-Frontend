import { TestBed } from '@angular/core/testing';

import { ContactsSignalRService } from './contactsSignalR.service';

describe('ContactsService', () => {
  let service: ContactsSignalRService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactsSignalRService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
