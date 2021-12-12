import { setLocation } from "./setLocation";
import { locationVar } from "../../cache";

export const mutations = {
  setLocation: setLocation(locationVar)
}