from ariadne import gql

type_defs = gql("""
    type Query {
        getEvents(input: GetEventsInput!): GetEventsPayload!
        getSatellitesInfo: GetSatellitesInfoPayload!
        getWeather(input: GetWeatherInput!): GetWeatherPayload!
    }

    input GetEventsInput {
        lat: Float!
        lng: Float!
        alt: Float
        dateFromIncUtc: String
    }
    input GetWeatherInput {
        lat: Float!
        lng: Float!
    }

    type GetEventsPayload {
        dateFromIncUtc: String!
        dateToExcUtc: String!
        satelliteEvents: [SatelliteEvents!]!
    }
    type GetWeatherPayload {
        hourly: [Weather!]!
    }
    type Weather {
        ref_time: Int!
        clouds: Int!
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
    type GetSatellitesInfoPayload {
        info: [SatelliteInfo!]!
    }
    type SatelliteInfo {
        name: String!
        id: String!
        type: String!
    }
""")
