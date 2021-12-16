import { gql } from "@apollo/client";
import { IGetEventsPayload } from "../../interfaces/ISatelliteEvent";

export interface GetEventsInput {
  lat: number;
  lng: number;
  dateFromIncUtc?: string;
}
export interface GetEventsPayload {
  getEvents: IGetEventsPayload;
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