"""Aplicação Flask Modular - VERSÃO DE TESTE"""
from flask import Flask, render_template
from config import Config
from models import db

app = Flask(__name__)
app.config.from_object(Config)

# Inicializar SQLAlchemy
db.init_app(app)

# Registrar blueprints
from routes import register_blueprints
register_blueprints(app)

@app.route('/')
def index():
    """Página principal"""
    return render_template('index.html')

@app.route('/test-modular')
def test_modular():
    """Rota de teste para verificar se a estrutura modular está funcionando"""
    return {
        'success': True,
        'message': '✅ Estrutura modular funcionando!',
        'blueprints': [bp.name for bp in app.blueprints.values()]
    }

@app.after_request
def set_security_headers(response):
    """Headers de segurança"""
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    return response

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
