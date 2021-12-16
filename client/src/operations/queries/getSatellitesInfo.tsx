import { gql } from "@apollo/client";

export interface GetSatellitesInfoPayload {
  getSatellitesInfo: {
    info: {
      name: string;
      id: string;
      type: string;
    }[];
  }
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