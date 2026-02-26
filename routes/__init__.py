"""Inicialização dos blueprints"""
from flask import Flask

def register_blueprints(app: Flask):
    """Registra todos os blueprints na aplicação"""
    from routes.auth import auth_bp
    from routes.transactions import transactions_bp
    from routes.metas import metas_bp
    
    # Registrar blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(transactions_bp, url_prefix='/api')
    app.register_blueprint(metas_bp, url_prefix='/api/metas')
