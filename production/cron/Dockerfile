FROM python:3-slim-buster
WORKDIR /app
COPY ./cron/requirements.txt .
RUN pip install -r requirements.txt
CMD ["python3", "main.py"]