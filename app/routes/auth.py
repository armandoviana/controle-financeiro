"""Rotas de autenticação"""
from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for
from functools import wraps
from datetime import datetime
from app.extensions import db, limiter
from app.models.user import User

auth_bp = Blueprint('auth', __name__)

# Limite de tentativas de login
login_attempts = {}
MAX_ATTEMPTS = 5
LOCKOUT_TIME = 300  # 5 minutos

def verificar_bloqueio(ip: str) -> bool:
    """Verifica se IP está bloqueado por tentativas excessivas"""
    if ip in login_attempts:
        attempts, last_attempt = login_attempts[ip]
        if attempts >= MAX_ATTEMPTS:
            if datetime.now().timestamp() - last_attempt < LOCKOUT_TIME:
                return True
            else:
                del login_attempts[ip]
    return False

def registrar_tentativa(ip: str, sucesso: bool):
    """Registra tentativa de login"""
    if sucesso:
        if ip in login_attempts:
            del login_attempts[ip]
    else:
        if ip in login_attempts:
            attempts, _ = login_attempts[ip]
            login_attempts[ip] = (attempts + 1, datetime.now().timestamp())
        else:
            login_attempts[ip] = (1, datetime.now().timestamp())

@auth_bp.route('/login', methods=['GET', 'POST'])
@limiter.limit("10 per minute")
def login():
    """Rota de login"""
    if request.method == 'POST':
        ip = request.remote_addr
        
        if verificar_bloqueio(ip):
            return jsonify({
                'success': False, 
                'message': 'Muitas tentativas. Tente novamente em 5 minutos.'
            }), 429
        
        data = request.json
        usuario = data.get('usuario', '')
        senha = data.get('senha', '')
        
        if not usuario or not senha:
            return jsonify({'success': False, 'message': 'Usuário e senha são obrigatórios'}), 400
        
        try:
            # Buscar usuário no banco
            user = User.query.filter_by(username=usuario).first()
            
            if user and user.check_password(senha):
                session['logged_in'] = True
                session['user_id'] = user.id
                session['username'] = user.username
                session.permanent = True
                registrar_tentativa(ip, True)
                return jsonify({'success': True})
            else:
                registrar_tentativa(ip, False)
                return jsonify({'success': False, 'message': 'Usuário ou senha inválidos'}), 401
        except Exception as e:
            print(f"❌ Erro no login: {e}")
            return jsonify({'success': False, 'message': 'Erro no servidor'}), 500
    
    return render_template('login.html')

@auth_bp.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    """Rota de cadastro de novos usuários"""
    if request.method == 'POST':
        try:
            data = request.json
            username = data.get('usuario', '').strip()
            senha = data.get('senha', '')
            confirmar_senha = data.get('confirmar_senha', '')
            email = data.get('email', '').strip()
            
            # Validações
            if not username or not senha:
                return jsonify({'success': False, 'message': 'Usuário e senha são obrigatórios'}), 400
            
            if len(username) < 3:
                return jsonify({'success': False, 'message': 'Usuário deve ter no mínimo 3 caracteres'}), 400
            
            if len(senha) < 6:
                return jsonify({'success': False, 'message': 'Senha deve ter no mínimo 6 caracteres'}), 400
            
            if senha != confirmar_senha:
                return jsonify({'success': False, 'message': 'As senhas não coincidem'}), 400
            
            # Verificar se username já existe
            if User.query.filter_by(username=username).first():
                return jsonify({'success': False, 'message': 'Username já está em uso'}), 400
            
            # Criar usuário
            user = User(username=username, email=email)
            user.set_password(senha)
            db.session.add(user)
            db.session.commit()
            
            return jsonify({'success': True, 'message': 'Conta criada com sucesso!'})
        except Exception as e:
            db.session.rollback()
            print(f"❌ Erro no cadastro: {e}")
            return jsonify({'success': False, 'message': f'Erro ao criar conta: {str(e)}'}), 500
    
    return render_template('cadastro.html')

@auth_bp.route('/logout')
def logout():
    """Rota de logout"""
    session.clear()
    return redirect(url_for('auth.login'))
