import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key'
    JSON_SORT_KEYS = False
    JSONIFY_PRETTYPRINT_REGULAR = True
    CORS_ENABLED = os.environ.get('CORS_ENABLED', 'true').lower() == 'true'
    HOST = os.environ.get('HOST', '0.0.0.0')
    PORT = int(os.environ.get('PORT', 5000))
    DEBUG = os.environ.get('DEBUG', 'true').lower() == 'true'
    FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
    
    @staticmethod
    def get_cors_origins():
        origins = os.environ.get('CORS_ORIGINS', '')
        if origins:
            return [origin.strip() for origin in origins.split(',') if origin.strip()]
        return ['*']  # Allow all origins if not specified

class ProductionConfig(Config):
    DEBUG = False
    TESTING = False

class DevelopmentConfig(Config):
    DEBUG = True
    TESTING = False

class TestingConfig(Config):
    DEBUG = True
    TESTING = True

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
