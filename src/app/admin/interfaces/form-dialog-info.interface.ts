import { Network } from "../../shared/interfaces/network.interface";
import { Station } from "../../shared/interfaces/station.interface";

export interface FormDialogInfo {
  showdialog: boolean;
  title: string;
  action: 'create' | 'update';
  network?: Network;
  station?: Station;
}
