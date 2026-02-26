"""Rotas ORM - Versão refatorada com SQLAlchemy"""
from flask import request, jsonify, session
from datetime import datetime
from models import db
from models.transaction import Receita, Gasto
from models.meta import Meta

def receitas_orm_handler():
    """Handler ORM para /api/receitas"""
    user_id = session.get('user_id')
    
    if request.method == 'POST':
        data = request.json
        
        # Validação
        if not data.get('descricao') or not data.get('valor') or not data.get('tipo') or not data.get('data'):
            return jsonify({'success': False, 'message': 'Dados incompletos'}), 400
        
        try:
            valor = float(data['valor'])
            if valor <= 0:
                raise ValueError('Valor deve ser positivo')
        except (ValueError, TypeError):
            return jsonify({'success': False, 'message': 'Valor inválido'}), 400
        
        # Criar receita
        receita = Receita(
            user_id=user_id,
            descricao=data['descricao'][:200],
            valor=valor,
            tipo=data['tipo'],
            data=datetime.strptime(data['data'], '%Y-%m-%d').date(),
            notas=data.get('notas', ''),
            tags=data.get('tags', '')
        )
        db.session.add(receita)
        db.session.commit()
        return jsonify({'success': True})
    
    elif request.method == 'PUT':
        data = request.json
        receita_id = data.get('id')
        
        if not receita_id:
            return jsonify({'success': False, 'message': 'ID não fornecido'}), 400
        
        try:
            valor = float(data['valor'])
            if valor <= 0:
                raise ValueError('Valor deve ser positivo')
        except (ValueError, TypeError):
            return jsonify({'success': False, 'message': 'Valor inválido'}), 400
        
        # Atualizar
        receita = Receita.query.filter_by(id=receita_id, user_id=user_id).first()
        if not receita:
            return jsonify({'success': False, 'message': 'Receita não encontrada'}), 404
        
        receita.descricao = data['descricao'][:200]
        receita.valor = valor
        receita.tipo = data['tipo']
        receita.data = datetime.strptime(data['data'], '%Y-%m-%d').date()
        receita.notas = data.get('notas', '')
        receita.tags = data.get('tags', '')
        db.session.commit()
        return jsonify({'success': True})
    
    elif request.method == 'DELETE':
        receita_id = request.args.get('id')
        if not receita_id:
            return jsonify({'success': False, 'message': 'ID não fornecido'}), 400
        
        receita = Receita.query.filter_by(id=receita_id, user_id=user_id).first()
        if not receita:
            return jsonify({'success': False, 'message': 'Receita não encontrada'}), 404
        
        db.session.delete(receita)
        db.session.commit()
        return jsonify({'success': True})
    
    # GET
    receitas = Receita.query.filter_by(user_id=user_id).order_by(Receita.data.desc()).all()
    return jsonify([r.to_dict() for r in receitas])


def gastos_orm_handler():
    """Handler ORM para /api/gastos"""
    user_id = session.get('user_id')
    
    if request.method == 'POST':
        data = request.json
        
        # Validação
        if not data.get('descricao') or not data.get('valor') or not data.get('categoria') or not data.get('data'):
            return jsonify({'success': False, 'message': 'Dados incompletos'}), 400
        
        try:
            valor = float(data['valor'])
            if valor <= 0:
                raise ValueError('Valor deve ser positivo')
        except (ValueError, TypeError):
            return jsonify({'success': False, 'message': 'Valor inválido'}), 400
        
        # Criar gasto
        gasto = Gasto(
            user_id=user_id,
            descricao=data['descricao'][:200],
            valor=valor,
            categoria=data['categoria'],
            data=datetime.strptime(data['data'], '%Y-%m-%d').date(),
            notas=data.get('notas', ''),
            tags=data.get('tags', '')
        )
        db.session.add(gasto)
        db.session.commit()
        return jsonify({'success': True, 'id': gasto.id})
    
    elif request.method == 'PUT':
        data = request.json
        gasto_id = data.get('id')
        
        if not gasto_id:
            return jsonify({'success': False, 'message': 'ID não fornecido'}), 400
        
        try:
            valor = float(data['valor'])
            if valor <= 0:
                raise ValueError('Valor deve ser positivo')
        except (ValueError, TypeError):
            return jsonify({'success': False, 'message': 'Valor inválido'}), 400
        
        # Atualizar
        gasto = Gasto.query.filter_by(id=gasto_id, user_id=user_id).first()
        if not gasto:
            return jsonify({'success': False, 'message': 'Gasto não encontrado'}), 404
        
        gasto.descricao = data['descricao'][:200]
        gasto.valor = valor
        gasto.categoria = data['categoria']
        gasto.data = datetime.strptime(data['data'], '%Y-%m-%d').date()
        gasto.notas = data.get('notas', '')
        gasto.tags = data.get('tags', '')
        db.session.commit()
        return jsonify({'success': True})
    
    elif request.method == 'DELETE':
        gasto_id = request.args.get('id')
        if not gasto_id:
            return jsonify({'success': False, 'message': 'ID não fornecido'}), 400
        
        gasto = Gasto.query.filter_by(id=gasto_id, user_id=user_id).first()
        if not gasto:
            return jsonify({'success': False, 'message': 'Gasto não encontrado'}), 404
        
        db.session.delete(gasto)
        db.session.commit()
        return jsonify({'success': True})
    
    # GET
    gastos = Gasto.query.filter_by(user_id=user_id).order_by(Gasto.data.desc()).all()
    return jsonify([g.to_dict() for g in gastos])


def metas_orm_handler():
    """Handler ORM para /api/metas"""
    user_id = session.get('user_id')
    
    if request.method == 'POST':
        data = request.json
        
        meta = Meta(
            user_id=user_id,
            titulo=data['titulo'],
            valor_alvo=float(data['valor_alvo']),
            valor_atual=float(data.get('valor_atual', 0)),
            data_inicio=datetime.strptime(data['data_inicio'], '%Y-%m-%d').date(),
            data_fim=datetime.strptime(data['data_fim'], '%Y-%m-%d').date(),
            tipo=data['tipo']
        )
        db.session.add(meta)
        db.session.commit()
        return jsonify({'success': True})
    
    elif request.method == 'PUT':
        data = request.json
        meta_id = data.get('id')
        
        if not meta_id:
            return jsonify({'success': False, 'message': 'ID não fornecido'}), 400
        
        meta = Meta.query.filter_by(id=meta_id, user_id=user_id).first()
        if not meta:
            return jsonify({'success': False, 'message': 'Meta não encontrada'}), 404
        
        meta.titulo = data['titulo']
        meta.valor_alvo = float(data['valor_alvo'])
        meta.valor_atual = float(data.get('valor_atual', meta.valor_atual))
        meta.data_inicio = datetime.strptime(data['data_inicio'], '%Y-%m-%d').date()
        meta.data_fim = datetime.strptime(data['data_fim'], '%Y-%m-%d').date()
        meta.tipo = data['tipo']
        db.session.commit()
        return jsonify({'success': True})
    
    elif request.method == 'DELETE':
        meta_id = request.args.get('id')
        if not meta_id:
            return jsonify({'success': False, 'message': 'ID não fornecido'}), 400
        
        meta = Meta.query.filter_by(id=meta_id, user_id=user_id).first()
        if not meta:
            return jsonify({'success': False, 'message': 'Meta não encontrada'}), 404
        
        db.session.delete(meta)
        db.session.commit()
        return jsonify({'success': True})
    
    # GET
    metas = Meta.query.filter_by(user_id=user_id).all()
    return jsonify([m.to_dict() for m in metas])
