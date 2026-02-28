"""Rotas de metas"""
from flask import Blueprint
from app.routes_orm import metas_orm_handler
from app.utils.decorators import login_required, api_error_handler

metas_bp = Blueprint('metas', __name__, url_prefix='/api/metas')

@metas_bp.route('/', methods=['GET', 'POST', 'PUT', 'DELETE'])
@api_error_handler
@login_required
def metas():
    """Rota de metas"""
    return metas_orm_handler()

