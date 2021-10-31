from datetime import datetime, timedelta
from Weather import Weather
from skyfield.api import load, wgs84
from skyfield import almanac
import pytz

from Satellites import Satellites

lat = 51.4545
lon = -2.5879
weather = Weather(lat, lon)
satellites = Satellites(lat, lon)
passes = satellites.get_passes()


def of_interest(t1: datetime):
    in_wake = t1.hour > 17 or t1.hour < 1
    if not in_wake:
        return False

    return True


for p in passes:
    d1 = p['visible_pass'][0].utc_datetime()
    d2 = p['visible_pass'][2].utc_datetime()
    p['is_visible'] = weather.is_clear(d1) or weather.is_clear(d2)
    p['in_interest_time'] = of_interest(d1)
    print(p['satellite'].name, d1, p['is_visible'], p['in_interest_time'])


# all_passes = []
# for satellite in satellites:
#     # print(satellite)
#     passes = find_next_visible_passes(
#         location, t0, t1, 30.0, planets, satellite, fn_is_twilight)
#     if len(passes) > 0:
#         for p in passes:
#             interest = of_interest(p[0].utc_datetime(), p[2].utc_datetime())
#             clear = weather.is_clear(p[0].utc_datetime())
#             all_passes.append((satellite, p, interest, clear))
#             # if of_interest(p[0].utc_datetime(), p[2].utc_datetime()) and is_clear(p[0].utc_datetime()):
#             #     print(satellite)
#             #     print(
#             #         f'Rise {p[0].utc_datetime()} @ {p[1]}, Set {p[2].utc_datetime()} @ {p[3]}')

# all_passes.sort(key=lambda x: x[1][0].utc_datetime())
# for p in all_passes:
#     print(p[0].name, p[1][0].utc_datetime(), p[2], p[3])
#     # print(
#     #     f'Rise {p[0].utc_datetime()} @ {p[1]}, Set {p[2].utc_datetime()} @ {p[3]}')
