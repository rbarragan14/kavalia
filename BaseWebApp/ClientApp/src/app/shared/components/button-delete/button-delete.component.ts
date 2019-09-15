import { EventEmitter, Component, Output, Input } from '@angular/core';
import { ConfirmCancelEvent } from 'angular-confirmation-popover/confirmation-popover.directive';

@Component({
  selector: 'app-button-delete',
  template: `
    <button
      mwlConfirmationPopover
      type="button"
      [popoverTitle]="popoverTitle"
      [popoverMessage]="popoverMessage"
      [cancelText]="cancelText"
      [confirmText]="confirmText"
      (confirm)="onConfirm($event)"
      [placement]="placement"
      class="btn btn-sm btn-danger">
      <i class="fa fa-trash"></i> {{label}}
    </button>
  `
})
export class ButtonDeleteComponent {
  popoverTitle = 'Confirmar Borrado';
  popoverMessage = 'El registro será borrado de forma permanente, por favor confirme la acción.';
  cancelText = 'Cancelar';
  confirmText = 'Confirmar';

  @Input() public label = 'Borrar';
  @Input() public placement = 'right';
  @Output() confirm: EventEmitter<ConfirmCancelEvent> = new EventEmitter();

  onConfirm(event: ConfirmCancelEvent) {
    this.confirm.emit(event);
  }
}
