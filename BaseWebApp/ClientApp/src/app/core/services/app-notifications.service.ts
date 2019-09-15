import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';

@Injectable()
export class AppNotificationsService {

    readonly options = {
        timeOut: 5000,
        animate: 'scale',
        position: ['top', 'right'],
        /// theClass: 'app-notification'
      };

    constructor(private notificationsService: NotificationsService) {
    }

    alert(message?: string, title?: string, override?: any): any | null {
        return this.notificationsService.alert(title, message, this.options);
    }

    success(message?: string, title?: string, override?: any): any | null {
        return this.notificationsService.success(title, message, this.options);
    }

    info(message?: string, title?: string, override?: any): any | null {
        return this.notificationsService.info(title, message, this.options);
    }

    warning(message?: string, title?: string, override?: any): any | null {
        return this.notificationsService.warn(title, message, this.options);
    }

    error(message?: string, title?: string, override?: any): any | null {
        return this.notificationsService.error(title, message, this.options);
    }
}
