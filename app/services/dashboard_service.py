"""Serviço de Dashboard - Resumo Financeiro"""
from app.extensions import db
from app.models.transaction import Receita, Gasto
from sqlalchemy import func, extract
from datetime import datetime

def obter_resumo(user_id, mes=None, ano=None):
    """Retorna resumo financeiro do usuário"""
    try:
        if not mes:
            mes = datetime.now().month
        if not ano:
            ano = datetime.now().year
        
        # Receitas do mês
        receitas_mes = db.session.query(
            func.sum(Receita.valor)
        ).filter(
            Receita.user_id == user_id,
            extract('year', Receita.data) == ano,
            extract('month', Receita.data) == mes
        ).scalar() or 0
        
        # Gastos do mês
        gastos_mes = db.session.query(
            func.sum(Gasto.valor)
        ).filter(
            Gasto.user_id == user_id,
            extract('year', Gasto.data) == ano,
            extract('month', Gasto.data) == mes
        ).scalar() or 0
        
        # Totais gerais
        receitas_total = db.session.query(
            func.sum(Receita.valor)
        ).filter(Receita.user_id == user_id).scalar() or 0
        
        gastos_total = db.session.query(
            func.sum(Gasto.valor)
        ).filter(Gasto.user_id == user_id).scalar() or 0
        
        return {
            'receitas': float(receitas_mes),
            'gastos': float(gastos_mes),
            'saldo': float(receitas_mes - gastos_mes),
            'receitas_total': float(receitas_total),
            'gastos_total': float(gastos_total)
        }
    except Exception as e:
        print(f"❌ Erro em obter_resumo: {e}")
        import traceback
        traceback.print_exc()
        return {
            'receitas': 0,
            'gastos': 0,
            'saldo': 0,
            'receitas_total': 0,
            'gastos_total': 0
        }

def obter_evolucao(user_id, meses=6):
    """Retorna evolução mensal de receitas e gastos"""
    hoje = datetime.now()
    dados = []
    
    for i in range(meses - 1, -1, -1):
        mes = hoje.month - i
        ano = hoje.year
        
        if mes <= 0:
            mes += 12
            ano -= 1
        
        receitas = db.session.query(
            func.sum(Receita.valor)
        ).filter(
            Receita.user_id == user_id,
            extract('year', Receita.data) == ano,
            extract('month', Receita.data) == mes
        ).scalar() or 0
        
        gastos = db.session.query(
            func.sum(Gasto.valor)
        ).filter(
            Gasto.user_id == user_id,
            extract('year', Gasto.data) == ano,
            extract('month', Gasto.data) == mes
        ).scalar() or 0
        
        dados.append({
            'mes': f"{ano}-{mes:02d}",
            'receitas': float(receitas),
            'gastos': float(gastos),
            'saldo': float(receitas - gastos)
        })
    
    return dados
