import { gql } from "@apollo/client";

export interface GetSatellitesInfoPayload {
  info: {
    name: string;
    id: string;
    type: string;
  }[];
}
export interface GetSatellitesInfoData {
  getSatellitesInfo: GetSatellitesInfoPayload;
}

export const GET_SATELLITES_INFO = gql`
  query GetSatellitesInfo {
    getSatellitesInfo {
      info {
        name
        id
        type
      }
    }
  }
`