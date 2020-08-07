FROM python:3.6-alpine
ADD float_conv.py /
ADD requirements.txt /
RUN pip install -r requirements.txt
CMD [ "python", "./float_conv.py" ]
