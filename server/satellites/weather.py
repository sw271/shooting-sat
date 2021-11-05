from datetime import datetime, timedelta
from pyowm import OWM
from decouple import config


class weather:
    _open_weather_api_key = config('OPEN_WEATHER_API_KEY')
    _owm = OWM(_open_weather_api_key)
    _mgr = _owm.weather_manager()
    _one_call_object = None
    cloud_cover_limit = 50

    def __init__(self, lat: float, lng: float) -> None:
        self._lat = lat
        self._lng = lng

    def fetch(self) -> None:
        self._one_call_object = self._mgr.one_call(
            lat=self._lat, lon=self._lng)

    def cloud_cover(self, date: datetime) -> bool:
        if self._one_call_object == None:
            self.fetch()

        hrly_fc = self._one_call_object.forecast_hourly
        for fc in hrly_fc:
            fc_date: datetime = fc.reference_time('date')
            if date >= fc_date and date <= fc_date + timedelta(hours=1):
                return fc.clouds

        return None
