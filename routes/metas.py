"""Rotas de metas"""
from flask import Blueprint, request, jsonify, session
from functools import wraps
from routes_orm import metas_orm_handler

metas_bp = Blueprint('metas', __name__)

def login_required(f):
    """Decorator para rotas que requerem login"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            return jsonify({'success': False, 'message': 'Login necessário'}), 401
        return f(*args, **kwargs)
    return decorated_function

def api_error_handler(f):
    """Decorator que captura erros e retorna JSON"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            print(f"❌ Erro em {f.__name__}: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({'success': False, 'message': f'Erro: {str(e)}'}), 500
    return decorated_function

@metas_bp.route('/', methods=['GET', 'POST', 'PUT', 'DELETE'])
@api_error_handler
@login_required
def metas():
    """Rota de metas"""
    return metas_orm_handler()
