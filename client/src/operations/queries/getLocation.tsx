import { gql } from "@apollo/client";

export const GET_LOCATION = gql`
  query getLocation {
    location @client { 
      latitude
      longitude
    }
  }
`