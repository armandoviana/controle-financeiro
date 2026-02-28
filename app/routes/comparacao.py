"""Rotas de comparação e relatórios"""
from flask import Blueprint, jsonify, request, session
from app.services.comparacao_service import comparar_anos, comparar_meses_entre_anos
from app.utils.decorators import login_required, api_error_handler

comparacao_bp = Blueprint('comparacao', __name__, url_prefix='/api/comparacao')

@comparacao_bp.route('/', methods=['GET'])
@api_error_handler
@login_required
def comparacao_default():
    """Rota padrão - redireciona para /anos"""
    user_id = session.get('user_id')
    ano_atual = request.args.get('ano_atual', type=int)
    ano_anterior = request.args.get('ano_anterior', type=int)
    dados = comparar_anos(user_id, ano_atual, ano_anterior)
    return jsonify({'success': True, 'dados': dados})

@comparacao_bp.route('/anos', methods=['GET'])
@api_error_handler
@login_required
def comparacao_anos():
    """Compara dados entre dois anos"""
    user_id = session.get('user_id')
    ano_atual = request.args.get('ano_atual', type=int)
    ano_anterior = request.args.get('ano_anterior', type=int)
    
    dados = comparar_anos(user_id, ano_atual, ano_anterior)
    return jsonify({'success': True, 'dados': dados})

@comparacao_bp.route('/mes', methods=['GET'])
@api_error_handler
@login_required
def comparacao_mes():
    """Compara um mês específico entre dois anos"""
    user_id = session.get('user_id')
    mes = request.args.get('mes', type=int)
    ano_atual = request.args.get('ano_atual', type=int)
    ano_anterior = request.args.get('ano_anterior', type=int)
    
    if not mes or mes < 1 or mes > 12:
        return jsonify({'success': False, 'error': 'Mês inválido'}), 400
    
    dados = comparar_meses_entre_anos(user_id, mes, ano_atual, ano_anterior)
    return jsonify({'success': True, 'dados': dados})
