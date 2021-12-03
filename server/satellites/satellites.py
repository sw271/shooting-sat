from datetime import datetime, timedelta
from enum import IntEnum
from typing import TypedDict
from skyfield.api import load, wgs84
from skyfield import almanac
import pytz


class SatelliteEventType(IntEnum):
    RISE = 0
    CULMINATE = 1
    SET = 2


class Event(TypedDict):
    dateUtc: datetime
    type: SatelliteEventType
    azimuth: float
    altitude: float


class SatelliteEvents(TypedDict):
    satelliteId: str
    events: list[Event]


class SatelliteVisibleEvents(TypedDict):
    dateFromIncUtc: datetime
    dateToExcUtc: datetime
    satelliteEvents: list[SatelliteEvents]


PLANETS_BSP = 'de421.bsp'
STATIONS_URL = '/data/visual.txt'
# print(post_weight(0))


def get_visible_events(lat: float, lng: float, altitude_degrees: float, date_from_utc: datetime = None, future_mins=120) -> SatelliteVisibleEvents:
    location = wgs84.latlon(lat, lng)
    planets = load(PLANETS_BSP)
    satellites = load.tle_file(STATIONS_URL)
    is_twilight_fn = almanac.dark_twilight_day(planets, location)
    ts = load.timescale()
    now = date_from_utc if date_from_utc else pytz.utc.localize(
        datetime.utcnow())
    t0 = ts.from_datetime(now)
    t1 = ts.from_datetime(now + timedelta(minutes=future_mins))

    # in an attempt to reduce computation:
    # only find_events during known twilight for the location:
    # and only if the timedelta is max 2hrs:
    if future_mins <= 120:
        if is_twilight_fn(t0) > 2 and is_twilight_fn(t1) > 2:
            print("Not twiglight hours, returning early")
            return {
                'dateFromIncUtc': t0.utc_datetime(),
                'dateToExcUtc': t1.utc_datetime(),
                'satelliteEvents': []
            }

    visible_satellite_events: list[SatelliteEvents] = []
    for satellite in satellites:
        t, events = satellite.find_events(location, t0, t1, altitude_degrees)
        diff = satellite - location
        satellite_events: SatelliteEvents = {
            'satelliteId': satellite.model.satnum,
            'events': []
        }
        for ti, event in zip(t, events):
            is_twilight = is_twilight_fn(ti)
            if is_twilight > 2 or not satellite.at(ti).is_sunlit(planets):
                continue
            alt, az, _ = diff.at(ti).altaz()
            satellite_events['events'].append({
                'altitude': alt.degrees,
                'azimuth': az.degrees,
                'dateUtc': ti.utc_datetime(),
                'type': event
            })
        if satellite_events['events']:
            visible_satellite_events.append(satellite_events)

    return {
        'dateFromIncUtc': t0.utc_datetime(),
        'dateToExcUtc': t1.utc_datetime(),
        'satelliteEvents': visible_satellite_events
    }
