import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'shared-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrl: './modal-dialog.component.css'
})
export class ModalDialogComponent {

  @Input({ required: true })
  title!: string;

  @Input({ required: true })
  description!: string;

  @Input() acceptButtonText?: string;
  @Input() discardButtonText?: string;

  @Output() acceptEvent = new EventEmitter<void>();
  @Output() discardEvent = new EventEmitter<void>();


  @Output()
  closeEvent = new EventEmitter<void>();

  onClose() {
    this.closeEvent.emit();
  }

  onAccept(): void {
    this.acceptEvent.emit();
  }

  onDiscard(): void {
    this.discardEvent.emit();
  }
}
