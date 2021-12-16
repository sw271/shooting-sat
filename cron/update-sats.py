import os
from datetime import datetime, timedelta
from urllib.request import urlretrieve

FILES = ['active.txt', 'visual.txt']
BASE_PATH = '/data'


def download_tle_file(filename):
    local_file = os.path.join(BASE_PATH, filename)
    if not os.path.isfile(local_file) or (os.path.getmtime(local_file) < (datetime.now() - timedelta(days=1)).timestamp()):
        print(f"Downloading {filename}")
        urlretrieve(
            f"https://www.celestrak.com/NORAD/elements/{filename}", local_file)
    else:
        print(f"No need to update {local_file}")

def download_sat_info():
    filename = "satcat.csv"
    local_file = os.path.join(BASE_PATH, filename)
    if not os.path.isfile(local_file) or (os.path.getmtime(local_file) < (datetime.now() - timedelta(days=7)).timestamp()):
        print(f"Downloading {filename}")
        urlretrieve("https://celestrak.com/pub/satcat.csv", local_file)
    else:
        print(f"No need to update {local_file}")


def main():
    download_sat_info()
    for file in FILES:
        download_tle_file(file)


if __name__ == "__main__":
    main()
