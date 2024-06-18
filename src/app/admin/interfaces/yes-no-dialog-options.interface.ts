export interface YesNoDialogOptions {
  title: string;
  description: string;
  acceptButtonText: string;
  discardButtonText: string;
  acceptEvent: () => void;
  discardEvent: () => void;
}
