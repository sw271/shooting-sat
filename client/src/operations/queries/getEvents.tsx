import { gql } from "@apollo/client";
import { ISatelliteEvents } from "../../models/ISatelliteEvent";

export interface GetEventsInput {
  lat: number;
  lng: number;
  dateFromIncUtc?: string;
}
export interface GetEventsPayload {
  dateFromIncUtc: string;
  dateToExcUtc: string;
  satelliteEvents: ISatelliteEvents[];
}
export interface GetEventsData {
  getEvents: GetEventsPayload;
}

export const GET_EVENTS = gql`
  query GetEvents($lat: Float!, $lng: Float!, $dateFromIncUtc: String) {
    getEvents(
      input: { lat: $lat, lng: $lng, dateFromIncUtc: $dateFromIncUtc }
    ) {
      dateFromIncUtc
      dateToExcUtc
      satelliteEvents {
        satelliteId
        events {
          dateUtc
          type
          azimuth
          altitude
        }
      }
    }
  }
`;