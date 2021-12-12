import {
  InMemoryCache, makeVar, ReactiveVar, useReactiveVar
} from "@apollo/client";
import { ILocation } from "./interfaces/ILocation";
import { IGetEventsPayload } from "./interfaces/ISatelliteEvent";
import { Location } from "./models/Location";
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist';
import { makePersistantVar } from "./makePersistantVar";


const cache: InMemoryCache = new InMemoryCache({

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

export const initializeCache = async () => {
  await persistCache({
    cache,
    storage: new LocalStorageWrapper(window.localStorage),
  });
  return cache;
}



export const locationVar: ReactiveVar<Location | undefined> = makePersistantVar<Location | undefined>(undefined, 'location');
export const locationScreenVar: ReactiveVar<boolean> = makeVar<boolean>(false);