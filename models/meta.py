"""Model de Metas"""
from datetime import datetime
from models import db

class Meta(db.Model):
    __tablename__ = 'metas'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False, index=True)
    titulo = db.Column(db.String(200), nullable=False)
    valor_alvo = db.Column(db.Float, nullable=False)
    valor_atual = db.Column(db.Float, default=0)
    data_inicio = db.Column(db.Date, nullable=False)
    data_fim = db.Column(db.Date, nullable=False)
    tipo = db.Column(db.String(50), nullable=False)
    concluida = db.Column(db.Boolean, default=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'titulo': self.titulo,
            'valor_alvo': self.valor_alvo,
            'valor_atual': self.valor_atual,
            'data_inicio': self.data_inicio.isoformat() if self.data_inicio else None,
            'data_fim': self.data_fim.isoformat() if self.data_fim else None,
            'tipo': self.tipo,
            'concluida': self.concluida,
            'percentual': round((self.valor_atual / self.valor_alvo * 100) if self.valor_alvo > 0 else 0, 1)
        }
    
    def __repr__(self):
        return f'<Meta {self.titulo} - {self.percentual}%>'
