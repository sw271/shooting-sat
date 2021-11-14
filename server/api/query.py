from ariadne import QueryType
from satellites.satellites import satellites
from satellites.weather import weather

query = QueryType()


@query.field("getPasses")
def resolve_get_passes(*_, input=None):
    if input is None:
        return

    lat = input['lat']
    lng = input['lng']
    print(f"Lat: {lat}")
    print(f"Lng: {lng}")

    if 'alt' in input:
        alt = input['alt']
        print(f"Alt: {alt}")
        sats = satellites(lat, lng, alt)
    else:
        sats = satellites(lat, lng)

    passes = sats.get_passes()
    w = weather(lat, lng)

    ret = dict(passes=[])
    for p in passes:
        rise_datetime = p['visible_pass'][0].utc_datetime()
        crnt = None
        if p['visible_pass'][2] is not None:
            set_datetime = p['visible_pass'][2].utc_datetime()
            crnt = dict(
                name=p['satellite'].name,
                riseDatetime=rise_datetime.isoformat(),
                riseAzimuth=p['visible_pass'][1].degrees,
                setDatetime=set_datetime.isoformat(),
                setAzimuth=p['visible_pass'][3].degrees,
                cloudCover=w.cloud_cover(rise_datetime)
            )
        else:
            crnt = dict(
                name=p['satellite'].name,
                riseDatetime=rise_datetime.isoformat(),
                riseAzimuth=p['visible_pass'][1].degrees,
                setDatetime=None,
                setAzimuth=None,
                cloudCover=w.cloud_cover(rise_datetime)
            )
        ret['passes'].append(crnt)

    return ret
