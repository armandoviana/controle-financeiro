# 🐘 Configurar PostgreSQL no Render

## 📋 Passo a Passo

### 1️⃣ Criar Banco PostgreSQL

1. Acesse https://dashboard.render.com
2. Clique em **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `controle-financeiro-db`
   - **Database**: `financeiro`
   - **User**: (gerado automaticamente)
   - **Region**: `Oregon (US West)`
   - **Plan**: **Free** (256MB)
4. Clique em **"Create Database"**
5. Aguarde ~2 minutos (status: Available)

---

### 2️⃣ Conectar ao Web Service

1. Vá em **Dashboard** → Seu web service (`controle-financeiro`)
2. Clique em **"Environment"** (menu lateral)
3. Clique em **"Add Environment Variable"**
4. Configure:
   - **Key**: `DATABASE_URL`
   - **Value**: Volte na aba do PostgreSQL → Copie **"Internal Database URL"**
5. Clique em **"Save Changes"**

---

### 3️⃣ Deploy Automático

O Render vai fazer deploy automaticamente após salvar a variável.

Aguarde ~2-3 minutos e pronto! 🎉

---

## ✅ Como Verificar

1. Acesse seu app
2. Adicione uma receita ou gasto
3. Faça um novo deploy (qualquer commit)
4. **Os dados continuam lá!** 🛡️

---

## 🔄 Migrar Dados Existentes (Opcional)

Se você já tem dados no SQLite local:

1. **Exporte** via botão "📊 Exportar Excel"
2. Faça deploy com PostgreSQL
3. **Importe** via botão "📂 Importar Excel"

---

## 💡 Dicas

- **Local**: Continua usando SQLite (`financas.db`)
- **Render**: Usa PostgreSQL automaticamente
- **Backups**: Render faz backup diário (plano free)
- **Limite**: 256MB = ~100.000 transações

---

## 🆘 Problemas?

**Erro de conexão:**
- Verifique se copiou a **Internal Database URL** (não a External)
- Certifique-se que começa com `postgres://` ou `postgresql://`

**Tabelas não criadas:**
- O sistema cria automaticamente no primeiro acesso
- Se não funcionar, vá em "Shell" do PostgreSQL e rode: `python database.py`

---

## 📊 Monitoramento

No painel do PostgreSQL você pode ver:
- Uso de espaço
- Conexões ativas
- Logs de queries
- Backups disponíveis
