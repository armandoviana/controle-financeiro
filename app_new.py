"""Aplicação Flask com SQLAlchemy - VERSÃO DE TESTE"""
from flask import Flask
from config import Config
from models import db
from models.user import User
from models.transaction import Receita, Gasto
from models.meta import Meta

app = Flask(__name__)
app.config.from_object(Config)

# Inicializar SQLAlchemy
db.init_app(app)

@app.route('/test-db')
def test_db():
    """Rota de teste para verificar se o SQLAlchemy está funcionando"""
    try:
        # Tenta contar usuários
        user_count = User.query.count()
        receita_count = Receita.query.count()
        gasto_count = Gasto.query.count()
        meta_count = Meta.query.count()
        
        return {
            'success': True,
            'message': 'SQLAlchemy funcionando!',
            'counts': {
                'usuarios': user_count,
                'receitas': receita_count,
                'gastos': gasto_count,
                'metas': meta_count
            }
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }, 500

if __name__ == '__main__':
    with app.app_context():
        # Criar tabelas se não existirem
        db.create_all()
        print("✅ Tabelas criadas/verificadas!")
    
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
