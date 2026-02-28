"""Serviço de Alertas"""
from app.extensions import db
from app.models.transaction import Gasto
from app.models.meta import Meta
from sqlalchemy import func, extract
from datetime import datetime, timedelta

def obter_alertas(user_id):
    """Gera alertas baseados em gastos e metas"""
    alertas = []
    hoje = datetime.now()
    mes_atual = hoje.month
    ano_atual = hoje.year
    
    # Alerta 1: Gastos acima da média
    gastos_mes_atual = db.session.query(
        func.sum(Gasto.valor)
    ).filter(
        Gasto.user_id == user_id,
        extract('year', Gasto.data) == ano_atual,
        extract('month', Gasto.data) == mes_atual
    ).scalar() or 0
    
    # Média dos últimos 3 meses
    total_3_meses = 0
    for i in range(1, 4):
        mes = mes_atual - i
        ano = ano_atual
        if mes <= 0:
            mes += 12
            ano -= 1
        
        gasto = db.session.query(
            func.sum(Gasto.valor)
        ).filter(
            Gasto.user_id == user_id,
            extract('year', Gasto.data) == ano,
            extract('month', Gasto.data) == mes
        ).scalar() or 0
        total_3_meses += gasto
    
    media_3_meses = total_3_meses / 3
    
    if gastos_mes_atual > media_3_meses * 1.2:
        alertas.append({
            'tipo': 'warning',
            'titulo': 'Gastos acima da média',
            'mensagem': f'Você gastou R$ {gastos_mes_atual:.2f} este mês, 20% acima da média de R$ {media_3_meses:.2f}'
        })
    
    # Alerta 2: Metas próximas do prazo
    metas = Meta.query.filter(
        Meta.user_id == user_id,
        Meta.concluida == False
    ).all()
    
    for meta in metas:
        dias_restantes = (meta.data_fim - hoje.date()).days
        percentual = (meta.valor_atual / meta.valor_alvo * 100) if meta.valor_alvo > 0 else 0
        
        if dias_restantes <= 7 and percentual < 90:
            alertas.append({
                'tipo': 'danger',
                'titulo': f'Meta "{meta.titulo}" próxima do prazo',
                'mensagem': f'Faltam {dias_restantes} dias e você está em {percentual:.0f}%'
            })
        elif percentual >= 100:
            alertas.append({
                'tipo': 'success',
                'titulo': f'Meta "{meta.titulo}" concluída! 🎉',
                'mensagem': f'Você atingiu {percentual:.0f}% da meta!'
            })
    
    return alertas
