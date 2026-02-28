"""Decorators compartilhados"""
from flask import session, jsonify, redirect, url_for
from functools import wraps
import traceback

def login_required(f):
    """Decorator para rotas que requerem login"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            return jsonify({'success': False, 'message': 'Login necessário'}), 401
        return f(*args, **kwargs)
    return decorated_function

def login_required_page(f):
    """Decorator para páginas que requerem login (redireciona)"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            return redirect(url_for('auth.login'))
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
            traceback.print_exc()
            return jsonify({'success': False, 'message': f'Erro: {str(e)}'}), 500
    return decorated_function
