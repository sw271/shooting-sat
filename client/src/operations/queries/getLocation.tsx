import { gql } from "@apollo/client";
import { ILocation } from "../../models/ILocation";

export interface GetLocationData {
  location: ILocation | undefined;
}

export const GET_LOCATION = gql`
  query getLocation {
    location @client { 
      latitude
      longitude
    }
  }
`