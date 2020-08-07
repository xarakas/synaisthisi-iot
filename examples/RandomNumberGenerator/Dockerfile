FROM python:3.6-alpine
ADD random_int.py /
ADD requirements.txt /
RUN pip install -r requirements.txt
CMD [ "python", "./random_int.py" ]
