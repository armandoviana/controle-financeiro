"""Rotas de transações (receitas e gastos)"""
from flask import Blueprint, request, jsonify, session
from functools import wraps
from routes_orm import receitas_orm_handler, gastos_orm_handler

transactions_bp = Blueprint('transactions', __name__)

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

@transactions_bp.route('/receitas', methods=['GET', 'POST', 'PUT', 'DELETE'])
@api_error_handler
@login_required
def receitas():
    """Rota de receitas"""
    return receitas_orm_handler()

@transactions_bp.route('/gastos', methods=['GET', 'POST', 'PUT', 'DELETE'])
@api_error_handler
@login_required
def gastos():
    """Rota de gastos"""
    return gastos_orm_handler()
