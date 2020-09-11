FROM nikolaik/python-nodejs:python3.8-nodejs14 as base

WORKDIR /
COPY . .

RUN ["pip", "install", "-r", "requirements.txt"]

RUN ["npm", "install"]

RUN ["cd", "server/", "&&", "pipenv", "run", "python", "tts.py"]

EXPOSE 3000

