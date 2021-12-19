import os
from datetime import datetime, timedelta
from urllib.request import urlretrieve
from timeloop import Timeloop
import time
BASE_PATH = '/data'


tl = Timeloop()


@tl.job(interval=timedelta(days=1))
def download_tle_file():
    filename = "visual.txt"
    local_file = os.path.join(BASE_PATH, filename)
    print(f"Downloading {filename}", flush=True)
    urlretrieve(
        f"https://www.celestrak.com/NORAD/elements/{filename}", local_file)

@tl.job(interval=timedelta(days=1))
def download_sat_info():
    filename = "satcat.csv"
    local_file = os.path.join(BASE_PATH, filename)
    print(f"Downloading {filename}", flush=True)
    urlretrieve("https://celestrak.com/pub/satcat.csv", local_file)

if __name__ == "__main__":
    download_tle_file()
    download_sat_info()
    tl.start(block=True)
