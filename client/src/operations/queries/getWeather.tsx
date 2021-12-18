import { gql } from "@apollo/client";
import { IWeather } from "../../models/IWeather";

export interface GetWeatherInput {
  lat: number;
  lng: number;
}
export interface GetWeatherPayload {
  hourly: IWeather[];
}
export interface GetWeatherData {
  getWeather: GetWeatherPayload;
}

export const GET_WEATHER = gql`
  query GetWeather($lat: Float!, $lng: Float!) {
    getWeather(
      input: { lat: $lat, lng: $lng }
    ) {
      hourly {
        ref_time
        clouds
      }
    }
  }
`;