"""Rotas do dashboard"""
from flask import Blueprint, render_template
from app.utils.decorators import login_required_page

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/dashboard')
@login_required_page
def dashboard():
    """Página principal do dashboard"""
    return render_template('index.html')

