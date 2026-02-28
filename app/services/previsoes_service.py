"""Serviço de Previsões"""
from app.extensions import db
from app.models.transaction import Gasto
from sqlalchemy import func, extract
from datetime import datetime
from collections import defaultdict

def obter_previsoes(user_id, meses_historico=3):
    """Calcula previsão de gastos por categoria baseado em histórico"""
    hoje = datetime.now()
    
    # Buscar gastos dos últimos N meses
    gastos_por_categoria = defaultdict(list)
    
    for i in range(meses_historico):
        mes = hoje.month - i
        ano = hoje.year
        
        if mes <= 0:
            mes += 12
            ano -= 1
        
        gastos = Gasto.query.filter(
            Gasto.user_id == user_id,
            extract('year', Gasto.data) == ano,
            extract('month', Gasto.data) == mes
        ).all()
        
        for gasto in gastos:
            gastos_por_categoria[gasto.categoria].append(gasto.valor)
    
    # Calcular média por categoria
    previsoes = []
    for categoria, valores in gastos_por_categoria.items():
        if valores:
            media = sum(valores) / len(valores)
            previsoes.append({
                'categoria': categoria,
                'previsao': round(media, 2),
                'base_meses': len(valores)
            })
    
    return sorted(previsoes, key=lambda x: x['previsao'], reverse=True)
