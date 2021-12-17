import { InMemoryCache, makeVar, ReactiveVar } from "@apollo/client";
import { ILocation } from "./models/ILocation";
import { makePersistantVar } from "./makePersistantVar";
import { GetEventsPayload } from "./operations/queries/getEvents";
import { ISatellitePass } from "./models/ISatellitePass";

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
        selectedSatellitePass: {
          read() {
            return selectedSatellitePassVar();
          }
        },
        getEvents: {
          keyArgs: false,
          merge(existing: GetEventsPayload, incoming: GetEventsPayload) {
            if (!existing) return incoming;
            // dont merge already gotten:
            if (incoming.dateFromIncUtc !== existing.dateToExcUtc) return incoming;
            const ret: GetEventsPayload = {
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

export const locationVar = makePersistantVar<ILocation | undefined>(undefined, 'location');
export const locationScreenVar = makeVar<boolean>(false);
export const selectedSatellitePassVar = makeVar<ISatellitePass | undefined>(undefined);