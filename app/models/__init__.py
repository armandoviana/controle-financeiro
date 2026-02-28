"""Modelos de dados"""
from app.extensions import db
from app.models.user import User
from app.models.transaction import Receita, Gasto
from app.models.meta import Meta
from app.models.recorrente import GastoRecorrente

__all__ = ['db', 'User', 'Receita', 'Gasto', 'Meta', 'GastoRecorrente']

