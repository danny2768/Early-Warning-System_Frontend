export interface Sensor {
  id:              string;
  name:            string;
  sensorType:      string;
  sendingInterval: number;
  stationId:       string;
  sendAlerts:      boolean;
  threshold:       Threshold;
  createdAt:       Date;
  updatedAt:       Date;
}

export interface Threshold {
  yellow: number;
  orange: number;
  red:    number;
}
