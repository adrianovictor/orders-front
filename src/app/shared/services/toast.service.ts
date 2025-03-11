import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private notificationService: NotificationService) {}

  showSuccess(message: string, action?: string): void {
    this.notificationService.notify({
      type: 'success',
      message,
      action
    });
  }
  
  showError(message: string, action?: string): void {
    this.notificationService.notify({
      type: 'error',
      message,
      action
    });
  }  

}
