"""Factory Pattern - Aplicação Flask"""
from flask import Flask, redirect, url_for, session, jsonify
from app.extensions import db, limiter
from app.config import Config
from flask_migrate import Migrate
import os

def create_app(config_class=Config):
    """Cria e configura a aplicação Flask"""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Inicializar extensões
    db.init_app(app)
    limiter.init_app(app)
    Migrate(app, db)
    
    # Registrar blueprints
    from app.routes.auth import auth_bp
    from app.routes.transactions import transactions_bp
    from app.routes.metas import metas_bp
    from app.routes.comparacao import comparacao_bp
    from app.routes.dashboard import dashboard_bp
    from app.routes.recorrentes import recorrentes_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(transactions_bp)
    app.register_blueprint(metas_bp)
    app.register_blueprint(comparacao_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(recorrentes_bp)
    
    # Rota raiz
    @app.route('/')
    def index():
        return redirect(url_for('auth.login'))
    
    # Health check
    @app.route('/health')
    def health():
        return {'status': 'healthy', 'version': '2.4.0'}, 200
    
    # Endpoint temporário para criar tabelas (remover após uso)
    @app.route('/init-db')
    def init_db():
        try:
            db.create_all()
            return {'status': 'success', 'message': 'Tabelas criadas!'}, 200
        except Exception as e:
            return {'status': 'error', 'message': str(e)}, 500
    
    # APIs com serviços reais
    from app.utils.decorators import login_required, api_error_handler
    from app.services.dashboard_service import obter_resumo, obter_evolucao
    from app.services.alertas_service import obter_alertas
    from app.services.tags_service import obter_tags, obter_relatorio_ir
    from app.services.previsoes_service import obter_previsoes
    
    @app.route('/api/resumo')
    @api_error_handler
    @login_required
    def resumo():
        user_id = session.get('user_id')
        dados = obter_resumo(user_id)
        return jsonify(dados)
    
    @app.route('/api/evolucao')
    @api_error_handler
    @login_required
    def evolucao():
        user_id = session.get('user_id')
        dados = obter_evolucao(user_id)
        return jsonify(dados)
    
    @app.route('/api/alertas')
    @api_error_handler
    @login_required
    def alertas():
        user_id = session.get('user_id')
        dados = obter_alertas(user_id)
        return jsonify(dados)
    
    @app.route('/api/tags')
    @api_error_handler
    @login_required
    def tags():
        user_id = session.get('user_id')
        dados = obter_tags(user_id)
        return jsonify(dados)
    
    @app.route('/api/previsoes')
    @api_error_handler
    @login_required
    def previsoes():
        user_id = session.get('user_id')
        dados = obter_previsoes(user_id)
        return jsonify(dados)
    
    @app.route('/api/relatorio-ir')
    @api_error_handler
    @login_required
    def relatorio_ir():
        user_id = session.get('user_id')
        dados = obter_relatorio_ir(user_id)
        return jsonify(dados)
    
    # Criar tabelas
    with app.app_context():
        db.create_all()
    
    # Headers de segurança
    @app.after_request
    def set_security_headers(response):
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        return response
    
    return app
