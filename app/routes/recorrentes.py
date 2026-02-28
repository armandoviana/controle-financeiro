"""Rotas de gastos recorrentes"""
from flask import Blueprint, request, jsonify, session
from app.services.recorrentes_service import (
    obter_recorrentes, criar_recorrente, atualizar_recorrente, 
    deletar_recorrente, gerar_gastos_do_mes
)
from app.utils.decorators import login_required, api_error_handler

recorrentes_bp = Blueprint('recorrentes', __name__, url_prefix='/api/recorrentes')

@recorrentes_bp.route('/', methods=['GET'])
@api_error_handler
@login_required
def listar_recorrentes():
    """Lista todos os gastos recorrentes"""
    user_id = session.get('user_id')
    dados = obter_recorrentes(user_id)
    return jsonify(dados)

@recorrentes_bp.route('/', methods=['POST'])
@api_error_handler
@login_required
def criar():
    """Cria um novo gasto recorrente"""
    user_id = session.get('user_id')
    data = request.json
    
    if not all(k in data for k in ['descricao', 'valor', 'categoria', 'dia_vencimento']):
        return jsonify({'success': False, 'message': 'Dados incompletos'}), 400
    
    resultado = criar_recorrente(
        user_id,
        data['descricao'],
        float(data['valor']),
        data['categoria'],
        int(data['dia_vencimento'])
    )
    return jsonify({'success': True, 'data': resultado})

@recorrentes_bp.route('/<int:recorrente_id>', methods=['PUT'])
@api_error_handler
@login_required
def atualizar(recorrente_id):
    """Atualiza um gasto recorrente"""
    user_id = session.get('user_id')
    data = request.json
    
    resultado = atualizar_recorrente(user_id, recorrente_id, data)
    if not resultado:
        return jsonify({'success': False, 'message': 'Recorrente não encontrado'}), 404
    
    return jsonify({'success': True, 'data': resultado})

@recorrentes_bp.route('/<int:recorrente_id>', methods=['DELETE'])
@api_error_handler
@login_required
def deletar(recorrente_id):
    """Deleta um gasto recorrente"""
    user_id = session.get('user_id')
    
    if deletar_recorrente(user_id, recorrente_id):
        return jsonify({'success': True})
    
    return jsonify({'success': False, 'message': 'Recorrente não encontrado'}), 404

@recorrentes_bp.route('/gerar', methods=['POST'])
@api_error_handler
@login_required
def gerar_gastos():
    """Gera gastos recorrentes para o mês"""
    user_id = session.get('user_id')
    data = request.json or {}
    
    mes = data.get('mes')
    ano = data.get('ano')
    
    gerados = gerar_gastos_do_mes(user_id, mes, ano)
    return jsonify({'success': True, 'gerados': gerados})
