import { ILocation } from "../../models/ILocation";
import { ReactiveVar } from "@apollo/client";

export const setLocation = (locationVar: ReactiveVar<ILocation | undefined>) => {
  return (location: ILocation | undefined) => {
    locationVar(location);
  }
}