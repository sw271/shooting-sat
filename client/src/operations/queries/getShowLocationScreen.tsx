import { gql } from "@apollo/client";

export const GET_SHOW_LOCATION_SCREEN = gql`
  query getShowLocationScreen {
    showLocationScreen @client
  }
`