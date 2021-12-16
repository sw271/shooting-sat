import { gql } from "@apollo/client";
import { Location } from "../../models/Location";

export interface GetLocationData {
  location: Location | undefined;
}

export const GET_LOCATION = gql`
  query getLocation {
    location @client { 
      latitude
      longitude
    }
  }
`