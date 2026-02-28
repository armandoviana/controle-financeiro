"""Serviço de Comparação Ano a Ano"""
from app.extensions import db
from app.models.transaction import Receita, Gasto
from sqlalchemy import func, extract
from datetime import datetime

def comparar_anos(user_id, ano_atual=None, ano_anterior=None):
    """Compara dados financeiros entre dois anos"""
    if not ano_atual:
        ano_atual = datetime.now().year
    if not ano_anterior:
        ano_anterior = ano_atual - 1
    
    # Receitas por ano
    receitas_atual = db.session.query(
        func.sum(Receita.valor)
    ).filter(
        Receita.user_id == user_id,
        extract('year', Receita.data) == ano_atual
    ).scalar() or 0
    
    receitas_anterior = db.session.query(
        func.sum(Receita.valor)
    ).filter(
        Receita.user_id == user_id,
        extract('year', Receita.data) == ano_anterior
    ).scalar() or 0
    
    # Gastos por ano
    gastos_atual = db.session.query(
        func.sum(Gasto.valor)
    ).filter(
        Gasto.user_id == user_id,
        extract('year', Gasto.data) == ano_atual
    ).scalar() or 0
    
    gastos_anterior = db.session.query(
        func.sum(Gasto.valor)
    ).filter(
        Gasto.user_id == user_id,
        extract('year', Gasto.data) == ano_anterior
    ).scalar() or 0
    
    # Calcular variações
    variacao_receitas = ((receitas_atual - receitas_anterior) / receitas_anterior * 100) if receitas_anterior > 0 else 0
    variacao_gastos = ((gastos_atual - gastos_anterior) / gastos_anterior * 100) if gastos_anterior > 0 else 0
    
    saldo_atual = receitas_atual - gastos_atual
    saldo_anterior = receitas_anterior - gastos_anterior
    variacao_saldo = ((saldo_atual - saldo_anterior) / abs(saldo_anterior) * 100) if saldo_anterior != 0 else 0
    
    return {
        'ano_atual': ano_atual,
        'ano_anterior': ano_anterior,
        'receitas': {
            'atual': float(receitas_atual),
            'anterior': float(receitas_anterior),
            'variacao': round(variacao_receitas, 2)
        },
        'gastos': {
            'atual': float(gastos_atual),
            'anterior': float(gastos_anterior),
            'variacao': round(variacao_gastos, 2)
        },
        'saldo': {
            'atual': float(saldo_atual),
            'anterior': float(saldo_anterior),
            'variacao': round(variacao_saldo, 2)
        }
    }

def comparar_meses_entre_anos(user_id, mes, ano_atual=None, ano_anterior=None):
    """Compara um mês específico entre dois anos"""
    if not ano_atual:
        ano_atual = datetime.now().year
    if not ano_anterior:
        ano_anterior = ano_atual - 1
    
    # Receitas do mês
    receitas_atual = db.session.query(
        func.sum(Receita.valor)
    ).filter(
        Receita.user_id == user_id,
        extract('year', Receita.data) == ano_atual,
        extract('month', Receita.data) == mes
    ).scalar() or 0
    
    receitas_anterior = db.session.query(
        func.sum(Receita.valor)
    ).filter(
        Receita.user_id == user_id,
        extract('year', Receita.data) == ano_anterior,
        extract('month', Receita.data) == mes
    ).scalar() or 0
    
    # Gastos do mês
    gastos_atual = db.session.query(
        func.sum(Gasto.valor)
    ).filter(
        Gasto.user_id == user_id,
        extract('year', Gasto.data) == ano_atual,
        extract('month', Gasto.data) == mes
    ).scalar() or 0
    
    gastos_anterior = db.session.query(
        func.sum(Gasto.valor)
    ).filter(
        Gasto.user_id == user_id,
        extract('year', Gasto.data) == ano_anterior,
        extract('month', Gasto.data) == mes
    ).scalar() or 0
    
    return {
        'mes': mes,
        'ano_atual': ano_atual,
        'ano_anterior': ano_anterior,
        'receitas': {
            'atual': float(receitas_atual),
            'anterior': float(receitas_anterior)
        },
        'gastos': {
            'atual': float(gastos_atual),
            'anterior': float(gastos_anterior)
        }
    }

