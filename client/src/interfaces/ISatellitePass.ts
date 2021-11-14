export interface ISatellitePass {
  name: string;
  riseDatetime: string;
  riseAzimuth: number;
  setDatetime?: string;
  setAzimuth?: number;
  cloudCover?: number;
}
