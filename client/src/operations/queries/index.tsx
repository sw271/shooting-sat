import { useQuery } from "@apollo/client";
import { Location } from "../../models/Location";
import { GET_LOCATION } from "./getLocation";
import { GetSatellitesInfoPayload, GET_SATELLITES_INFO } from "./getSatellitesInfo";
import { GET_SHOW_LOCATION_SCREEN } from "./getShowLocationScreen";


export const useGetLocation = () => useQuery<{ location: Location | undefined }>(GET_LOCATION);
export const useGetShowLocation = () => useQuery<{ showLocationScreen: boolean }>(GET_SHOW_LOCATION_SCREEN);
export const useGetSatellitesInfo = () => useQuery<GetSatellitesInfoPayload>(GET_SATELLITES_INFO);