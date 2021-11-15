from datetime import datetime, timedelta
from skyfield.api import load, wgs84
from skyfield import almanac
import pytz


class satellites:

    planets_bsp = 'de421.bsp'
    stations_url = '/data/visual.txt'
    future_hours = 24 * 2

    def __init__(self, lat: float, lng: float, altitude_degrees=30.0) -> None:
        self._location = wgs84.latlon(lat, lng)
        self._planets = load(self.planets_bsp)
        self._satellites = load.tle_file(self.stations_url)
        self._altitude_degrees = altitude_degrees
        self._is_twilight = almanac.dark_twilight_day(
            self._planets, self._location)
        print('Loaded', len(self._satellites), 'satellites')

    def get_passes(self):
        ts = load.timescale()
        now = pytz.utc.localize(datetime.utcnow())
        t0 = ts.from_datetime(now)
        t1 = ts.from_datetime(now + timedelta(hours=self.future_hours))
        all_passes = []
        count = 1
        total = len(self._satellites)
        for satellite in self._satellites:
            print(f"Checking satellite ${count} of ${total}")
            count += 1
            passes = self._find_next_visible_passes(
                self._location, t0, t1, self._altitude_degrees, self._planets, satellite)
            if len(passes) > 0:
                for p in passes:
                    all_passes.append(
                        dict(satellite=satellite, visible_pass=p))
        all_passes.sort(key=lambda x: x['visible_pass'][0].utc_datetime())
        return all_passes

    def _find_next_visible_passes(self, location, t1, t2, altitude_degrees, eph, satellite):

        ret = []
        riseTime, riseAz, setTime, setAz = None, None, None, None
        # Culminate may occur more than once, so collect them all.
        culminateTimes = []
        t, events = satellite.find_events(location, t1, t2, altitude_degrees)
        diff = satellite - location
        for ti, event in zip(t, events):
            if event == 0:  # Rise
                riseTime = ti
                alt, riseAz, distance = diff.at(riseTime).altaz()

            elif event == 1:  # Culminate
                culminateTimes.append(ti)

            else:  # Set
                if riseTime is not None and culminateTimes:
                    for culmination in culminateTimes:
                        # 1 = Astronomical, 2 = Nautical
                        is_twilight = self._is_twilight(culmination)
                        if (is_twilight == 1 or is_twilight == 2) and satellite.at(culmination).is_sunlit(eph):
                            setTime = ti
                            alt, setAz, distance = diff.at(ti).altaz()
                            ret.append((riseTime, riseAz, setTime, setAz))
                            break
                culminateTimes = []
                riseTime, riseAz, setTime, setAz = None, None, None, None

        if riseTime is not None:
            ret.append((riseTime, riseAz, setTime, setAz))
        return ret
