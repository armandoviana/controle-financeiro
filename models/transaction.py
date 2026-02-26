"""Models de Transações (Receitas e Gastos)"""
from datetime import datetime
from models import db

class Receita(db.Model):
    __tablename__ = 'receitas'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False, index=True)
    descricao = db.Column(db.String(200), nullable=False)
    valor = db.Column(db.Float, nullable=False)
    tipo = db.Column(db.String(50), nullable=False)
    data = db.Column(db.Date, nullable=False, index=True)
    notas = db.Column(db.Text)
    tags = db.Column(db.String(200))
    
    def to_dict(self):
        return {
            'id': self.id,
            'descricao': self.descricao,
            'valor': self.valor,
            'tipo': self.tipo,
            'data': self.data.isoformat() if self.data else None,
            'notas': self.notas,
            'tags': self.tags
        }
    
    def __repr__(self):
        return f'<Receita {self.descricao} - R$ {self.valor}>'


class Gasto(db.Model):
    __tablename__ = 'gastos'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False, index=True)
    descricao = db.Column(db.String(200), nullable=False)
    valor = db.Column(db.Float, nullable=False)
    categoria = db.Column(db.String(50), nullable=False, index=True)
    data = db.Column(db.Date, nullable=False, index=True)
    notas = db.Column(db.Text)
    tags = db.Column(db.String(200))
    
    def to_dict(self):
        return {
            'id': self.id,
            'descricao': self.descricao,
            'valor': self.valor,
            'categoria': self.categoria,
            'data': self.data.isoformat() if self.data else None,
            'notas': self.notas,
            'tags': self.tags
        }
    
    def __repr__(self):
        return f'<Gasto {self.descricao} - R$ {self.valor}>'
