import { useQuery } from "@apollo/client";
import { Location } from "../../models/Location";
import { GET_LOCATION } from "./getLocation";


export const useGetLocation = () => useQuery<{ location: Location }>(GET_LOCATION);
export const useGetShowLocation = () => useQuery<{ showLocationScreen: boolean }>(GET_LOCATION);