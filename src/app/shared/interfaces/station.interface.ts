import { Coordinates } from "./coordinates.interface";

export interface Station {
  id:          string;
  name:        string;
  state:       string;
  countryCode: string;
  coordinates: Coordinates;
  networkId?:  string;
  createdAt:   Date;
  updatedAt:   Date;
}
