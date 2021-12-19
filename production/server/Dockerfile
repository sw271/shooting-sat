FROM python:3-slim-buster as production
WORKDIR /app
COPY ./server .
COPY ./data /data
RUN pip install -r requirements.txt
CMD ["uvicorn", "--host=0.0.0.0", "--reload", "app:app"]