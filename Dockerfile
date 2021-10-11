# build environment
FROM node:13.12.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY client/package.json .
COPY client/package-lock.json .
RUN npm ci --silent
RUN npm install react-scripts@3.4.1 -g --silent
COPY client/ .
RUN npm run build


# Use the official lightweight Python image.
# https://hub.docker.com/_/python
FROM python:3.9-slim

# Allow statements and log messages to immediately appear in the Knative logs
ENV PYTHONUNBUFFERED True

# Copy local code to the container image.
ENV APP_HOME /app/server
WORKDIR $APP_HOME
COPY ./server .
COPY ./config ../config

COPY --from=build /app/build ../client/build

# Install production dependencies.
RUN pip install --no-cache-dir -r requirements.txt

# TODO: This needs some work...
RUN python init_db.py

# Run the web service on container startup. Here we use the gunicorn
# webserver, with one worker process and 8 threads.
# For environments with multiple CPU cores, increase the number of workers
# to be equal to the cores available.
# Timeout is set to 0 to disable the timeouts of the workers to allow Cloud Run to handle instance scaling.
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 app:app