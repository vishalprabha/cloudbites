FROM python:3.9.7
LABEL MAINTAINER="Soumyadeb <soma5722@colorado.edu>"

RUN  pip3 install --upgrade redis pika requests tweepy kafka-python confluent-kafka turtle

WORKDIR /srv
COPY    kafka-consumer.py /srv
#COPY    config.py /srv
ENV PYTHONUNBUFFERED=1
ENV PYTHONIOENCODING=UTF-8
CMD [ "python3", "kafka-consumer.py"]