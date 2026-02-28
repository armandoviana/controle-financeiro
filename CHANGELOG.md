# 📋 CHANGELOG

## [2.4.4] - 2026-02-28

### Corrigido
- Código JavaScript solto removido (linha 859)
- Service Worker com caminhos corretos
- Funções modais inline no HTML para evitar cache
- Duplicatas de funções removidas

### Melhorado
- Validação completa do código
- Limpeza de arquivos temporários
- Documentação atualizada

## [2.4.0] - 2026-02-28

### Adicionado
- Factory Pattern com Flask blueprints
- Camada de serviços (dashboard, alertas, previsões, tags, recorrentes, comparação)
- SQLAlchemy ORM models
- Bcrypt para hash de senhas
- Flask-Limiter para rate limiting
- Flask-Migrate para migrations
- Gunicorn WSGI server
- Health check endpoint
- PostgreSQL support
- Security headers

### Modificado
- Refatoração completa da arquitetura
- Decorators centralizados
- User isolation em todas as queries
- Frontend responsivo melhorado
- Script versioning para cache busting

### Removido
- SHA-256 (substituído por bcrypt)
- React frontend
- Código duplicado
- Arquivos de backup antigos

## [2.3.0] - 2026-02-27

### Adicionado
- Gastos recorrentes com templates
- Comparação anual
- Filtros por mês
- Relatório IR

### Melhorado
- Design responsivo
- Performance do frontend
- Tratamento de erros

## [2.2.0] - 2026-02-26

### Adicionado
- Dashboard interativo
- Gráficos Chart.js
- Metas financeiras
- Previsões inteligentes

## [2.1.0] - 2026-02-25

### Adicionado
- Sistema de login
- CRUD de receitas e gastos
- Tags personalizadas

## [2.0.0] - 2026-02-24

### Adicionado
- Versão inicial com Flask
- SQLite database
- Frontend vanilla JS
