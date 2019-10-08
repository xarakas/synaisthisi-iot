# FROM python:3.6-alpine
FROM petronetto/opencv-alpine


ADD pType.py /
ADD requirements.txt /
ADD haarcascade_frontalface_default.xml /

ADD loop.py /

RUN pip install -r requirements.txt


CMD [ "python", "./pType.py" ]


# CMD [ "python", "./loop.py" ]
