from datetime import datetime, timedelta
from pyowm import OWM
from decouple import config


class weather:
    _open_weather_api_key = config('OPEN_WEATHER_API_KEY')
    _owm = OWM(_open_weather_api_key)
    _mgr = _owm.weather_manager()

    def forecast_hourly(self, lat: float, lng: float):
        return self._mgr.one_call(
            lat=lat, lon=lng).forecast_hourly
