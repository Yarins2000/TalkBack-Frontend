import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<boolean>(false);

  get notificationObservable$(): Observable<boolean>{
    return this.notificationSubject.asObservable();
  }

  setNotification(value: boolean){
    this.notificationSubject.next(value);
  }
}
