from datetime import datetime
from ariadne import QueryType
from satellites.satellites import get_visible_events, get_satellites_info
from satellites.weather import weather

query = QueryType()


@query.field("getEvents")
def resolve_get_events(*_, input):
    if input is None:
        return
    lat = input['lat']
    lng = input['lng']
    print(f"Lat: {lat}")
    print(f"Lng: {lng}")
    alt = 30.0
    if 'alt' in input:
        alt = input['alt']
    print(f"Alt: {alt}")
    date = None
    if 'dateFromIncUtc' in input:
        date = datetime.fromisoformat(input['dateFromIncUtc'])
    print(f"Date: {date}")

    return get_visible_events(lat=lat, lng=lng, altitude_degrees=alt, date_from_utc=date)

@query.field("getSatellitesInfo")
def resolve_get_satellites_info(*_):
    return {
        "info": get_satellites_info()
    }

@query.field("getWeather")
def resolve_get_weather(*_, input):
    if input is None:
        return
    lat = input['lat']
    lng = input['lng']
    print(f"Lat: {lat}")
    print(f"Lng: {lng}")
    print("------------------CALLING WEATHER ----------------------")
    w = weather().forecast_hourly(lat, lng)
    return {
        "hourly": w
    }