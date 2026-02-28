# 💰 Controle Financeiro

Sistema web completo de controle financeiro pessoal. Simples, direto e profissional.

## Funcionalidades

- 📊 **Dashboard interativo** com gráficos e resumo mensal
- 💸 **Gastos recorrentes** com 12 templates prontos (aluguel, Netflix, etc)
- 🎯 **Metas financeiras** com acompanhamento de progresso
- 📈 **Previsões inteligentes** baseadas em histórico
- 🔍 **Filtros por mês** com destaque para gastos fixos
- 📑 **Relatório IR** com despesas dedutíveis
- 📊 **Comparação anual** entre anos
- 📱 **100% responsivo** - funciona perfeitamente no celular
- 🔐 **Seguro** - bcrypt + rate limiting + session cookies
- ⚡ **Rápido** - vanilla JS, sem frameworks pesados

## Como rodar

### No seu computador

```bash
# Baixa o projeto
git clone https://github.com/armandoviana/controle-financeiro.git
cd controle-financeiro

# Cria ambiente virtual (recomendado)
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# ou venv\Scripts\activate no Windows

# Instala as dependências
pip install -r requirements.txt

# Cria o banco de dados e primeiro usuário
python3 criar_usuario.py

# Roda o servidor
python3 run.py
# ou use: ./start.sh
```

Depois é só abrir http://127.0.0.1:5000 no navegador.

### Configuração (opcional)

Crie um arquivo `.env` (copie do `.env.example`):
```bash
FLASK_DEBUG=True  # False em produção
SECRET_KEY=sua-chave-secreta-aqui
# DATABASE_URL=postgresql://...  # Opcional, usa SQLite se não definido
```

## Principais funcionalidades

**Dashboard**: Mostra o resumo do mês - quanto entrou, quanto saiu, quanto sobrou. Tem um "score de saúde financeira" que vai de 0 a 100 baseado no seu saldo. Meio bobo, mas ajuda a ter noção.

**Gastos recorrentes**: Cadastra uma vez coisas como aluguel, Netflix, conta de luz. Todo mês o sistema gera automaticamente. Tem 12 templates prontos, é só clicar e ajustar o valor se precisar.

**Filtro por mês**: Quer ver só os gastos de janeiro? Seleciona o mês e pronto. Os gastos fixos aparecem destacados com uma borda rosa pra você identificar rápido.

**Metas**: Define quanto quer juntar e até quando. O sistema avisa quando está perto do prazo. Útil pra não esquecer aquela viagem que você tá planejando.

**Previsões**: Olha seus gastos dos últimos 3 meses e tenta prever quanto você vai gastar em cada categoria. Não é perfeito, mas dá uma ideia.

**Relatório de IR**: Separa receitas e despesas dedutíveis (saúde e educação) pra facilitar na hora de declarar imposto. Economiza um tempo danado.

**Excel**: Exporta tudo pra Excel se você quiser fazer suas próprias análises. E também importa, caso você tenha dados em planilha.

**Gráficos interativos**: Usa Chart.js pra mostrar gráfico de pizza (distribuição por categoria) e gráfico de linha (evolução de receitas vs gastos). Dá pra ver os valores passando o mouse por cima.

**PWA**: Funciona como app instalável. Adiciona na tela inicial do celular e usa offline depois da primeira carga. Tem ícone próprio e tudo.

## Mobile

Funciona bem no celular. O menu fica embaixo, igual apps tipo Instagram ou WhatsApp. Testei no iPhone e Android, roda tranquilo. Dá pra adicionar na tela inicial e usar como se fosse um app.

## Tecnologias

**Backend:**
- Flask 3.0 (Python web framework)
- SQLAlchemy (ORM)
- Flask-Migrate (migrations)
- Bcrypt (hash de senhas)
- Flask-Limiter (rate limiting)
- Gunicorn (WSGI server)

**Frontend:**
- HTML5 + CSS3 (Glassmorphism design)
- JavaScript Vanilla (sem frameworks)
- Chart.js 4.4 (gráficos interativos)
- Service Worker (PWA/offline)

**Database:**
- SQLite (desenvolvimento)
- PostgreSQL (produção)

**Deploy:**
- Render.com (free tier)
- Git-based deployment

## Segurança

- **Bcrypt** para hash de senhas (substituiu SHA-256)
- **Rate limiting** - 10 tentativas/min no login, 200 req/dia global
- **Session cookies** seguros com httponly
- **Security headers** (X-Frame-Options, X-XSS-Protection)
- **User isolation** - cada usuário vê apenas seus dados
- **CSRF protection** via Flask

## Arquitetura

**Factory Pattern** com Flask blueprints:
- `app/routes/` - Endpoints organizados por funcionalidade
- `app/services/` - Lógica de negócio isolada
- `app/models/` - SQLAlchemy ORM models
- `app/utils/` - Decorators e helpers compartilhados

**Modelos:**
- User (bcrypt password)
- Receita (income)
- Gasto (expense)
- Meta (goals)
- GastoRecorrente (recurring expenses)

## Licença

Fique à vontade pra usar, modificar, o que quiser. É um projeto pessoal que resolvi compartilhar. Se ajudar alguém, já valeu.
