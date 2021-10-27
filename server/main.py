from datetime import datetime, timedelta
from skyfield.api import load, wgs84
from skyfield import almanac
import pytz
from pyowm import OWM
from decouple import config

lat = 51.4545
lon = -2.5879

open_weather_api_key = config('OPEN_WEATHER_API_KEY')
owm = OWM(open_weather_api_key)
mgr = owm.weather_manager()
one_call_object = mgr.one_call(lat=lat, lon=lon)

hrly = one_call_object.forecast_hourly  # .reference_time()


def is_clear(t1: datetime):
    for fc in hrly:
        d: datetime = fc.reference_time('date')
        if t1 >= d and t1 <= d + timedelta(hours=1):
            return fc.clouds < 50
    if hrly[-1].reference_time('date') < t1:
        raise Exception("Forecast outside date")


for fc in hrly:
    print(fc.reference_time('date'), fc.clouds)


def find_next_visible_passes(location, t1, t2, altitude_degrees, eph, satellite, fn_is_twilight):

    ret = []
    riseTime, riseAz, setTime, setAz = None, None, None, None
    # Culminate may occur more than once, so collect them all.
    culminateTimes = []
    t, events = satellite.find_events(location, t1, t2, altitude_degrees)
    for ti, event in zip(t, events):
        if event == 0:  # Rise
            riseTime = ti

        elif event == 1:  # Culminate
            culminateTimes.append(ti)

        else:  # Set
            if riseTime is not None and culminateTimes:
                for culmination in culminateTimes:
                    isTwilight = fn_is_twilight(culmination) == 1 or fn_is_twilight(
                        culmination) == 2  # 1 = Astronomical, 2 = Nautical
                    if isTwilight and satellite.at(culmination).is_sunlit(eph):
                        diff = satellite - location
                        alt, riseAz, distance = diff.at(riseTime).altaz()
                        setTime = ti
                        alt, setAz, distance = diff.at(ti).altaz()
                        ret.append((riseTime, riseAz, setTime, setAz))
                        break

            culminateTimes = []
            riseTime, riseAz, setTime, setAz = None, None, None, None

    return ret


planets = load('de421.bsp')
stations_url = './stations.txt'
satellites = load.tle_file(stations_url)
print('Loaded', len(satellites), 'satellites')

location = wgs84.latlon(lat, lon)
ts = load.timescale()
now = pytz.utc.localize(datetime.utcnow())
t0 = ts.from_datetime(now)
t1 = ts.from_datetime(now + timedelta(days=2))
# day = 27
# t0 = ts.tt(2021, 10, day, 18, 8, 0)
# t1 = ts.tt(2021, 10, day+1, 0, 0, 0)

fn_is_twilight = almanac.dark_twilight_day(planets, location)


def of_interest(t1: datetime, t2: datetime):
    in_wake = t2.hour > 17 and t1.hour < 23
    if not in_wake:
        return False

    return True


for satellite in satellites:
    # print(satellite)
    passes = find_next_visible_passes(
        location, t0, t1, 30.0, planets, satellite, fn_is_twilight)
    if len(passes) > 0:
        for p in passes:
            if of_interest(p[0].utc_datetime(), p[2].utc_datetime()) and is_clear(p[0].utc_datetime()):
                print(satellite)
                print(
                    f'Rise {p[0].utc_datetime()} @ {p[1]}, Set {p[2].utc_datetime()} @ {p[3]}')
