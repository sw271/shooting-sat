import { IHorizontalPosition } from "./IHorizontalCoordinate";
import { IWeather } from "./IWeather";

export interface ISatellitePass {
  name: string;
  rise: IHorizontalPosition;
  set: IHorizontalPosition;
  weather: IWeather;
}
