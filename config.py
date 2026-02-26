"""Configurações da aplicação"""
import os
from datetime import timedelta

class Config:
    """Configuração base"""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    
    # Database
    DATABASE_URL = os.environ.get('DATABASE_URL')
    if DATABASE_URL and DATABASE_URL.startswith('postgres://'):
        DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
    
    SQLALCHEMY_DATABASE_URI = DATABASE_URL or 'sqlite:///financas.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Session
    SESSION_COOKIE_SECURE = False  # True em produção com HTTPS
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    PERMANENT_SESSION_LIFETIME = timedelta(hours=24)
    
    # Security
    MAX_LOGIN_ATTEMPTS = 5
    LOCKOUT_TIME = 300  # 5 minutos
