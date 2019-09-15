import { ErrorHandler, Injectable, ApplicationRef, Injector } from '@angular/core';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  //// private ns: AppNotificationsService = null;

  constructor(private inj: Injector, private ns: AppNotificationsService) {
  }

  handleError(errorResponse: any): void {
    //// this.ns = this.inj.get(AppNotificationsService);

    if (errorResponse.status === 401) {
      this.ns.error('No autorizado');
      this.inj.get(ApplicationRef).tick();
    } else if (errorResponse.status === 404) {
      this.ns.error('No encontrado');
      this.inj.get(ApplicationRef).tick();
    } else if (errorResponse.status === 400) {
      console.log('***** HANDLE ERROR *****');
      this.ns.error(errorResponse.error.message,
        this.formatErrors(errorResponse.error.errors)
      );
      this.inj.get(ApplicationRef).tick();
    } else if (errorResponse && errorResponse.rejection) {
      this.ns.error(errorResponse.rejection.error);
      this.inj.get(ApplicationRef).tick();
    } else {
      const error = errorResponse;
      this.ns.error(error);
    }

    console.error(errorResponse);

    // IMPORTANT: Don't Rethrow the error otherwise it will not emit errors after once
    // https://stackoverflow.com/questions/44356040/angular-global-error-handler-working-only-once
    // throw errorResponse;
  }

  private formatErrors(errors: any) {
    return errors ? errors.map((err: any) => err.message).join('<br/>') : '';
  }
}
