from ariadne import gql

type_defs = gql("""

    input GetPassesInput {
        lat: Float!
        lng: Float!
        alt: Float
    }

    type Query {
        getPasses(input: GetPassesInput!): GetPassesPayload!
    }

    type GetPassesPayload {
        passes: [SatellitePass!]!
    }

    type SatellitePass {
        name: String!
        riseDatetime: String!
        riseAzimuth: Float!
        setDatetime: String!
        setAzimuth: Float!
        cloudCover: Float
    }
""")
