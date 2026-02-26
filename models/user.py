"""Model de Usuário"""
from datetime import datetime
from models import db
import hashlib

class User(db.Model):
    __tablename__ = 'usuarios'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    receitas = db.relationship('Receita', backref='usuario', lazy=True, cascade='all, delete-orphan')
    gastos = db.relationship('Gasto', backref='usuario', lazy=True, cascade='all, delete-orphan')
    metas = db.relationship('Meta', backref='usuario', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password: str) -> None:
        """Define senha com hash SHA-256"""
        self.password_hash = hashlib.sha256(password.encode()).hexdigest()
    
    def check_password(self, password: str) -> bool:
        """Verifica senha"""
        return self.password_hash == hashlib.sha256(password.encode()).hexdigest()
    
    def __repr__(self):
        return f'<User {self.username}>'
