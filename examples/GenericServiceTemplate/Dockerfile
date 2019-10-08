FROM python:3.6-alpine
ADD service_test.py /
ADD requirements.txt /
RUN pip install -r requirements.txt
CMD [ "python", "./service_test.py" ]
