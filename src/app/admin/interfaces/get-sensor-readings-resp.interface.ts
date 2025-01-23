import { Pagination } from "../../shared/interfaces/pagination.interface";
import { Reading } from "./reading.interface";
import { Sensor } from "./sensor.interface";

export interface GetSensorReadingsResp {
  sensor:     Sensor;
  pagination: Pagination;
  readings:   Reading[];
}
