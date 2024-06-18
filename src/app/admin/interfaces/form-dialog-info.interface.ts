import { Network } from "../../shared/interfaces/network.interface";

export interface FormDialogInfo {
  showdialog: boolean;
  title: string;
  action: 'create' | 'update';
  network?: Network;
}
