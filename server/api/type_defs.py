from ariadne import gql

type_defs = gql("""
    type Query {
        getEvents(input: GetEventsInput!): GetEventsPayload!
    }

    input GetEventsInput {
        lat: Float!
        lng: Float!
        alt: Float
        dateFromIncUtc: String
    }

    type GetEventsPayload {
        dateFromIncUtc: String!
        dateToExcUtc: String!
        satelliteEvents: [SatelliteEvents!]!
    }

    enum EventType {
        RISE
        CULMINATE
        SET
    }
    type SatelliteEvents {
        satelliteId: String!
        events: [Event!]!
    }
    type Event {
        dateUtc: String!
        type: EventType!
        azimuth: Float!
        altitude: Float!
    }
""")
