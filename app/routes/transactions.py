"""Rotas de transações (receitas e gastos)"""
from flask import Blueprint, request, jsonify
from app.routes_orm import receitas_orm_handler, gastos_orm_handler
from app.utils.decorators import login_required, api_error_handler

transactions_bp = Blueprint('transactions', __name__, url_prefix='/api')

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

