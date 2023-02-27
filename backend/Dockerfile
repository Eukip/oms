FROM python:3.9
ENV PYTHONBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE 1
WORKDIR /backend

#COPY Pipfile Pipfile.lock /code/
COPY requirements.txt /backend/
#RUN pip install pipenv && pipenv install --system
RUN pip install -r requirements.txt
COPY . .
