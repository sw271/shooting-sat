FROM python:3-slim
WORKDIR /app
COPY ./server .
RUN apt-get update && \
    apt-get install -y \
        build-essential \
        make \
        gcc
RUN pip install -r requirements.txt
RUN apt-get remove -y --purge make gcc build-essential && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*
CMD ["uvicorn", "--host=0.0.0.0", "--reload", "app:app"]