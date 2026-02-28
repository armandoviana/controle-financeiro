"""Serviço de Gastos Recorrentes"""
from app.extensions import db
from app.models.recorrente import GastoRecorrente
from app.models.transaction import Gasto
from sqlalchemy import func
from datetime import datetime

def obter_recorrentes(user_id):
    """Lista todos os gastos recorrentes do usuário"""
    recorrentes = GastoRecorrente.query.filter_by(user_id=user_id).all()
    return [r.to_dict() for r in recorrentes]

def criar_recorrente(user_id, descricao, valor, categoria, dia_vencimento):
    """Cria um novo gasto recorrente"""
    recorrente = GastoRecorrente(
        user_id=user_id,
        descricao=descricao,
        valor=valor,
        categoria=categoria,
        dia_vencimento=dia_vencimento
    )
    db.session.add(recorrente)
    db.session.commit()
    return recorrente.to_dict()

def atualizar_recorrente(user_id, recorrente_id, dados):
    """Atualiza um gasto recorrente"""
    recorrente = GastoRecorrente.query.filter_by(id=recorrente_id, user_id=user_id).first()
    if not recorrente:
        return None
    
    recorrente.descricao = dados.get('descricao', recorrente.descricao)
    recorrente.valor = dados.get('valor', recorrente.valor)
    recorrente.categoria = dados.get('categoria', recorrente.categoria)
    recorrente.dia_vencimento = dados.get('dia_vencimento', recorrente.dia_vencimento)
    recorrente.ativo = dados.get('ativo', recorrente.ativo)
    db.session.commit()
    return recorrente.to_dict()

def deletar_recorrente(user_id, recorrente_id):
    """Deleta um gasto recorrente"""
    recorrente = GastoRecorrente.query.filter_by(id=recorrente_id, user_id=user_id).first()
    if not recorrente:
        return False
    
    db.session.delete(recorrente)
    db.session.commit()
    return True

def gerar_gastos_do_mes(user_id, mes=None, ano=None):
    """Gera gastos recorrentes para o mês especificado"""
    if not mes:
        mes = datetime.now().month
    if not ano:
        ano = datetime.now().year
    
    recorrentes = GastoRecorrente.query.filter_by(user_id=user_id, ativo=True).all()
    gerados = []
    
    for rec in recorrentes:
        # Verificar se já existe gasto para este recorrente no mês
        dia = min(rec.dia_vencimento, 28)  # Evitar dias inválidos
        data_gasto = datetime(ano, mes, dia).date()
        
        existe = Gasto.query.filter(
            Gasto.user_id == user_id,
            Gasto.descricao == rec.descricao,
            func.extract('year', Gasto.data) == ano,
            func.extract('month', Gasto.data) == mes
        ).first()
        
        if not existe:
            gasto = Gasto(
                user_id=user_id,
                descricao=rec.descricao,
                valor=rec.valor,
                categoria=rec.categoria,
                data=data_gasto,
                tags='recorrente'
            )
            db.session.add(gasto)
            gerados.append(gasto)
    
    db.session.commit()
    return [g.to_dict() for g in gerados]
