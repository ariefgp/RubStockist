import os


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # SQLAlchemy 1.4 no longer supports url strings that start with 'postgres'
    # (only 'postgresql') but heroku's postgres add-on automatically sets the
    # url in the hidden config vars to start with postgres.
    # so the connection uri must be updated here (for production)
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL').replace('postgres://', 'postgresql://')
    SQLALCHEMY_ECHO = True
    AV_API_KEY = os.environ.get('AV_API_KEY')
    TWELVE_API_KEY = os.environ.get('TWELVE_API_KEY')
    TWELVE_NATIVE_API_KEY = os.environ.get('TWELVE_NATIVE_API_KEY')
    FINN_HUB_API_KEY = os.environ.get('FINN_HUB_API_KEY')