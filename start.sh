#!/bin/bash
# Script de inicialização do Controle Financeiro

echo "🚀 Iniciando Controle Financeiro..."

# Ativar ambiente virtual
if [ -d "venv" ]; then
    source venv/bin/activate
    echo "✅ Ambiente virtual ativado"
else
    echo "❌ Ambiente virtual não encontrado. Execute: python3 -m venv venv"
    exit 1
fi

# Verificar dependências
echo "📦 Verificando dependências..."
pip install -q -r requirements.txt

# Criar banco se não existir
if [ ! -f "instance/financas.db" ]; then
    echo "🗄️  Criando banco de dados..."
    python3 -c "from app import create_app; app = create_app(); app.app_context().push(); from app.extensions import db; db.create_all(); print('✅ Banco criado')"
fi

# Iniciar servidor
echo "🌐 Iniciando servidor em http://127.0.0.1:5000"
echo "   Pressione CTRL+C para parar"
echo ""
python3 run.py
