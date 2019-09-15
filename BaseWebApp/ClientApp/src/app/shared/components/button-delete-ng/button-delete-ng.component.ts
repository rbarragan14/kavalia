import { EventEmitter, Component, Output, Input } from '@angular/core';
import { ConfirmCancelEvent } from 'angular-confirmation-popover/confirmation-popover.directive';

@Component({
  selector: 'app-button-delete-ng',
  template: `
    <button
      mwlConfirmationPopover
      pButton
      type="button"
      [popoverTitle]="popoverTitle"
      [popoverMessage]="popoverMessage"
      [cancelText]="cancelText"
      [confirmText]="confirmText"
      (confirm)="onConfirm($event)"
      [icon]="icon"
      [placement]="placement"
      [class]="class">
      {{label}}
    </button>
  `
})
export class ButtonDeleteNgComponent {
  popoverTitle = 'Confirmar Borrado';
  popoverMessage = 'El registro será borrado de forma permanente, por favor confirme la acción.';
  cancelText = 'Cancelar';
  confirmText = 'Confirmar';
  class = 'ui-button-danger';
  icon = 'pi pi-trash';

  @Input() public label = 'Borrar';
  @Input() public placement = 'right';
  @Output() confirm: EventEmitter<ConfirmCancelEvent> = new EventEmitter();

  onConfirm(event: ConfirmCancelEvent) {
    this.confirm.emit(event);
  }
}
