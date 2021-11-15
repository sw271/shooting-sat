import os
from datetime import datetime, timedelta
from urllib.request import urlretrieve

FILES = ['active.txt', 'visual.txt']
BASE_PATH = '/data'


def download_file(filename):
    local_file = os.path.join(BASE_PATH, filename)
    if not os.path.isfile(local_file) or (os.path.getmtime(local_file) < (datetime.now() - timedelta(days=1)).timestamp()):
        print(f"Downloading {filename}")
        urlretrieve(
            f"https://www.celestrak.com/NORAD/elements/{filename}", local_file)
    else:
        print(f"No need to update {local_file}")


def main():
    for file in FILES:
        download_file(file)


if __name__ == "__main__":
    main()
