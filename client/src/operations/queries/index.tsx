import { useQuery } from "@apollo/client";
import { InvariantError } from "@apollo/client/utilities/globals";
import { useEffect } from "react";
import { Location } from "../../models/Location";
import { GetEventsInput, GetEventsPayload, GET_EVENTS } from "./getEvents";
import { GET_LOCATION } from "./getLocation";
import { GetSatellitesInfoPayload, GET_SATELLITES_INFO } from "./getSatellitesInfo";
import { GET_SHOW_LOCATION_SCREEN } from "./getShowLocationScreen";


export const useGetLocation = () => useQuery<{ location: Location | undefined }>(GET_LOCATION);
export const useGetShowLocation = () => useQuery<{ showLocationScreen: boolean }>(GET_SHOW_LOCATION_SCREEN);
export const useGetSatellitesInfo = () => useQuery<GetSatellitesInfoPayload>(GET_SATELLITES_INFO);
export const useGetEvents = (variables: { lat: number, lng: number }) => {
  const q = useQuery<GetEventsPayload, GetEventsInput>(GET_EVENTS, { variables });
  useEffect(() => {
    if (q.data) {
      const firstDate = new Date(q.data.getEvents.dateFromIncUtc).valueOf();
      const lastDate = new Date(q.data.getEvents.dateToExcUtc).valueOf();
      if (lastDate - firstDate < 1000 * 60 * 60 * 24) {
        q.fetchMore({
          variables: {
            ...variables,
            dateFromIncUtc: q.data.getEvents.dateToExcUtc,
          },
        })
          .catch(e => {
            if (e instanceof InvariantError) {
              if (e.message === "Store reset while query was in flight (not completed in link chain)") {
                // pass: this is ok, we have probably hit the "forgert me button"
                console.log("Error caught while restting store");
                return;
              }
            }
            throw e;
          });
      }
    }
  });
  return q;
}