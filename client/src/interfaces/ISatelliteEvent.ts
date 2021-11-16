export interface IGetEventsPayload {
  dateFromIncUtc: string;
  dateToExcUtc: string;
  satelliteEvents: ISatelliteEvents[];
}

export interface ISatelliteEvents {
  satelliteId: string;
  events: IEvent[];
}

export interface IEvent {
  dateUtc: string;
  type: EEventType;
  azimuth: number;
  altitude: number;
}

export enum EEventType {
  RISE = "RISE",
  CULMINATE = "CULMINATE",
  SET = "SET",
}
