FROM nikolaik/python-nodejs:python3.8-nodejs14 as base

WORKDIR /
COPY . .

RUN ["pip", "install", "-r", "requirements.txt"]

RUN ["npm", "install"]
RUN ["npm", "run", "build"]

RUN ["cp", "-r", "dist", "server/static"]
RUN ["cp", "server/public/index.html", "server/static"]
RUN ["cp", "server/public/favicon.ico", "server/static"]

ENV FLASK_APP=server

EXPOSE 3000

CMD gunicorn --worker-class eventlet -w 1 server:app