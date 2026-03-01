"""Serviço de Relatório de Imposto de Renda"""
from app.extensions import db
from app.models.transaction import Receita, Gasto
from sqlalchemy import extract
from datetime import datetime

def obter_relatorio_ir(user_id, ano=None):
    """Retorna relatório para declaração de IR"""
    if not ano:
        ano = datetime.now().year
    
    try:
        # Receitas do ano
        receitas = Receita.query.filter(
            Receita.user_id == user_id,
            extract('year', Receita.data) == ano
        ).all()
        
        # Gastos dedutíveis (saúde e educação)
        gastos_dedutiveis = Gasto.query.filter(
            Gasto.user_id == user_id,
            extract('year', Gasto.data) == ano,
            Gasto.categoria.in_(['Saúde', 'Educação'])
        ).all()
        
        # Todos os gastos
        gastos = Gasto.query.filter(
            Gasto.user_id == user_id,
            extract('year', Gasto.data) == ano
        ).all()
        
        total_receitas = sum(r.valor for r in receitas)
        total_dedutiveis = sum(g.valor for g in gastos_dedutiveis)
        total_gastos = sum(g.valor for g in gastos)
        
        return {
            'ano': ano,
            'receitas': [
                {
                    'descricao': r.descricao,
                    'valor': float(r.valor),
                    'data': r.data.strftime('%Y-%m-%d'),
                    'categoria': r.categoria
                } for r in receitas
            ],
            'gastos_dedutiveis': [
                {
                    'descricao': g.descricao,
                    'valor': float(g.valor),
                    'data': g.data.strftime('%Y-%m-%d'),
                    'categoria': g.categoria
                } for g in gastos_dedutiveis
            ],
            'resumo': {
                'total_receitas': float(total_receitas),
                'total_dedutiveis': float(total_dedutiveis),
                'total_gastos': float(total_gastos),
                'base_calculo': float(total_receitas - total_dedutiveis)
            }
        }
    except Exception as e:
        print(f"❌ Erro em obter_relatorio_ir: {e}")
        return {
            'ano': ano,
            'receitas': [],
            'gastos_dedutiveis': [],
            'resumo': {
                'total_receitas': 0,
                'total_dedutiveis': 0,
                'total_gastos': 0,
                'base_calculo': 0
            }
        }
