"""Serviço de Tags e Relatório IR"""
from app.extensions import db
from app.models.transaction import Receita, Gasto
from sqlalchemy import func

def obter_tags(user_id):
    """Retorna todas as tags únicas usadas pelo usuário"""
    tags_receitas = db.session.query(Receita.tags).filter(
        Receita.user_id == user_id,
        Receita.tags != None,
        Receita.tags != ''
    ).all()
    
    tags_gastos = db.session.query(Gasto.tags).filter(
        Gasto.user_id == user_id,
        Gasto.tags != None,
        Gasto.tags != ''
    ).all()
    
    tags_set = set()
    for (tag,) in tags_receitas + tags_gastos:
        if tag:
            tags_set.update([t.strip() for t in tag.split(',') if t.strip()])
    
    return sorted(list(tags_set))

def obter_relatorio_ir(user_id, ano=None):
    """Gera relatório para Imposto de Renda"""
    from datetime import datetime
    if not ano:
        ano = datetime.now().year
    
    # Receitas do ano
    receitas = Receita.query.filter(
        Receita.user_id == user_id,
        func.extract('year', Receita.data) == ano
    ).all()
    
    # Despesas dedutíveis (saúde e educação)
    gastos_dedutiveis = Gasto.query.filter(
        Gasto.user_id == user_id,
        func.extract('year', Gasto.data) == ano,
        Gasto.categoria.in_(['Saúde', 'Educação'])
    ).all()
    
    return {
        'ano': ano,
        'receitas': [r.to_dict() for r in receitas],
        'despesas_dedutiveis': [g.to_dict() for g in gastos_dedutiveis],
        'total_receitas': sum(r.valor for r in receitas),
        'total_dedutiveis': sum(g.valor for g in gastos_dedutiveis)
    }
