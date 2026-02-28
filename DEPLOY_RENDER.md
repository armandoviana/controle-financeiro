# 🚀 Deploy no Render.com

Guia completo para fazer deploy do Controle Financeiro no Render.

## Pré-requisitos

- Conta no [Render.com](https://render.com) (gratuita)
- Repositório no GitHub com o código
- 10 minutos de paciência

## Passo 1: Preparar o Repositório

O projeto já está configurado com:
- ✅ `render.yaml` (configuração automática)
- ✅ `requirements.txt` (dependências)
- ✅ `run.py` (entry point)
- ✅ Gunicorn configurado

## Passo 2: Criar Web Service

1. Acesse [dashboard.render.com](https://dashboard.render.com)
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório GitHub
4. Selecione o repositório `controle-financeiro`

## Passo 3: Configurar o Service

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
gunicorn run:app
```

**Environment:**
- Python 3

## Passo 4: Criar PostgreSQL Database

1. No dashboard do Render, clique em **"New +"** → **"PostgreSQL"**
2. Nome: `controle-financeiro-db`
3. Database: `financeiro`
4. User: `financeiro_user`
5. Region: mesma do web service
6. Plan: **Free**
7. Clique em **"Create Database"**

## Passo 5: Configurar Variáveis de Ambiente

No seu Web Service, vá em **"Environment"** e adicione:

```bash
SECRET_KEY=sua-chave-super-secreta-aqui-mude-isso
DATABASE_URL=postgresql://user:password@host:5432/dbname
FLASK_DEBUG=False
```

**Importante:** 
- Copie a `DATABASE_URL` do PostgreSQL que você criou
- Gere uma `SECRET_KEY` forte (pode usar: `python -c "import secrets; print(secrets.token_hex(32))"`)

## Passo 6: Deploy

1. Clique em **"Create Web Service"**
2. Aguarde o build (3-5 minutos)
3. Quando aparecer "Live", seu app está no ar! 🎉

## Passo 7: Criar Primeiro Usuário

Acesse o terminal do Render (ou use o shell):

```bash
python3 << 'EOF'
from app import create_app
from app.extensions import db
from app.models import User

app = create_app()
with app.app_context():
    db.create_all()
    
    user = User(username='admin')
    user.set_password('sua-senha-aqui')
    
    db.session.add(user)
    db.session.commit()
    print('✅ Usuário criado!')
EOF
```

## Passo 8: Testar

Acesse a URL do seu app (ex: `https://controle-financeiro.onrender.com`) e faça login!

## Troubleshooting

**Build falhou?**
- Verifique se `requirements.txt` está correto
- Veja os logs no dashboard do Render

**App não inicia?**
- Verifique as variáveis de ambiente
- Confirme que `DATABASE_URL` está correta

**Erro de conexão com banco?**
- Aguarde 1-2 minutos após criar o PostgreSQL
- Verifique se copiou a URL completa

**App lento?**
- Normal no free tier do Render
- Primeira requisição pode demorar (cold start)

## Atualizações Futuras

Para atualizar o app:

```bash
git add .
git commit -m "Atualização"
git push origin main
```

O Render faz deploy automático! 🚀

## Custos

**Free Tier:**
- Web Service: 750 horas/mês (suficiente para 1 app)
- PostgreSQL: 90 dias grátis, depois $7/mês
- Bandwidth: 100 GB/mês

**Alternativa:** Use SQLite (sem PostgreSQL) para manter 100% gratuito, mas dados são perdidos em redeploys.

## Suporte

Problemas? Abra uma issue no GitHub ou consulte a [documentação do Render](https://render.com/docs).
