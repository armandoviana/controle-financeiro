"""Model de Gastos Recorrentes"""
from datetime import datetime
from app.extensions import db

class GastoRecorrente(db.Model):
    __tablename__ = 'gastos_recorrentes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False, index=True)
    descricao = db.Column(db.String(200), nullable=False)
    valor = db.Column(db.Float, nullable=False)
    categoria = db.Column(db.String(50), nullable=False)
    dia_vencimento = db.Column(db.Integer, nullable=False)  # 1-31
    ativo = db.Column(db.Boolean, default=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'descricao': self.descricao,
            'valor': self.valor,
            'categoria': self.categoria,
            'dia_vencimento': self.dia_vencimento,
            'ativo': self.ativo
        }
    
    def __repr__(self):
        return f'<GastoRecorrente {self.descricao} - R$ {self.valor}>'
