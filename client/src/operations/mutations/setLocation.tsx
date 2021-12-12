import { Location } from "../../models/Location";
import { ReactiveVar } from "@apollo/client";

export const setLocation = (locationVar: ReactiveVar<Location>) => {
  return (location: Location) => {
    locationVar(location);
  }
}