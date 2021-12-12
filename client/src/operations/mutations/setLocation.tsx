import { Location } from "../../models/Location";
import { ReactiveVar } from "@apollo/client";

export const setLocation = (locationVar: ReactiveVar<Location | undefined>) => {
  return (location: Location | undefined) => {
    locationVar(location);
  }
}