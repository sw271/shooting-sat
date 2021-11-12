import os
from datetime import datetime, timedelta
from urllib.request import urlretrieve

VISUAL_FILE = '/data/visual.txt'


def download_visual():
    print("Downloading visual.txt")
    urlretrieve(
        "https://www.celestrak.com/NORAD/elements/visual.txt", VISUAL_FILE)


def main():
    if not os.path.isfile(VISUAL_FILE):
        download_visual()
    elif os.path.getmtime(VISUAL_FILE) < (datetime.now() - timedelta(days=1)).timestamp():
        download_visual()
    else:
        print("No need to update")


if __name__ == "__main__":
    main()
