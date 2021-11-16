from ariadne import make_executable_schema
from ariadne.enums import EnumType
from satellites.satellites import SatelliteEventType
from .type_defs import type_defs
from .query import query

satellite_event_type = EnumType("EventType", SatelliteEventType)

schema = make_executable_schema(type_defs, [query, satellite_event_type])
