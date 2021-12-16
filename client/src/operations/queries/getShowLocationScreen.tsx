import { gql } from "@apollo/client";

export interface GetShowLocationScreenData {
  showLocationScreen: boolean;
}

export const GET_SHOW_LOCATION_SCREEN = gql`
  query getShowLocationScreen {
    showLocationScreen @client
  }
`