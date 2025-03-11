import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  action?: string;
  timestamp?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSource = new Subject<Notification>();
  
  notification$ = this.notificationSource.asObservable();

  notify(notification: Notification): void {
    notification.timestamp = Date.now();
    console.log('Enviando notificação:', notification);
    this.notificationSource.next(notification);
  }  
}
