import {
  InMemoryCache, makeVar, ReactiveVar,
} from "@apollo/client";
import { ILocation } from "./interfaces/ILocation";
import { IGetEventsPayload } from "./interfaces/ISatelliteEvent";
import { Location } from "./models/Location";


export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        location: {
          read() {
            return locationVar();
          }
        },
        showLocationScreen: {
          read() {
            return locationScreenVar();
          }
        },
        getEvents: {
          keyArgs: false,
          merge(existing: IGetEventsPayload, incoming: IGetEventsPayload) {
            if (!existing) return incoming;
            const ret: IGetEventsPayload = {
              ...existing,
              dateToExcUtc: incoming.dateToExcUtc,
              satelliteEvents: existing.satelliteEvents.map((x) => {
                return {
                  satelliteId: x.satelliteId,
                  events: [...x.events],
                };
              }),
            };

            incoming.satelliteEvents.forEach((e) => {
              const found = ret.satelliteEvents.find(
                (x) => x.satelliteId === e.satelliteId
              );
              if (found) {
                found.events.push(...e.events);
              } else {
                ret.satelliteEvents.push(e);
              }
            });

            return ret;
          },
        },
      },
    },
  },
});


export const locationVar: ReactiveVar<Location> = makeVar<Location>(undefined);
export const locationScreenVar: ReactiveVar<boolean> = makeVar<boolean>(false);