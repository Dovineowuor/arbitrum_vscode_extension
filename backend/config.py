import os

class Config:
    DEBUG = os.getenv('DEBUG', False)
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key')
    ARBITRUM_RPC_URL = os.getenv('ARBITRUM_RPC_URL', 'https://arb1.arbitrum.io/rpc')
    DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///app.db')  # Update with your database URL

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False
