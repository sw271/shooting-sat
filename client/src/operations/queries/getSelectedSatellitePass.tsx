import { gql } from "@apollo/client";
import { ISatellitePass } from "../../models/ISatellitePass";

export interface GetSelectedSattelitePass {
  selectedSatellitePass: ISatellitePass | undefined;
}

export const GET_SELECTED_SATELLITE_PASS = gql`
  query getSelectedSatellitePass {
    selectedSatellitePass @client
  }
`