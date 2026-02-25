# 💰 Controle Financeiro v2.2

Sistema completo de gestão financeira pessoal com recursos avançados de análise, previsão e organização.

[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0.0-green.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🚀 Funcionalidades

### 📊 Dashboard Inteligente
- Resumo visual de receitas, gastos e saldo
- Score de saúde financeira (0-100)
- Comparação mensal automática
- Gráficos de evolução (6 meses)
- **Gráfico de pizza** para distribuição visual
- Distribuição de gastos por categoria
- Alertas e notificações em tempo real
- **Animações suaves** nos cards ao passar o mouse

### ➕ Gestão de Transações
- Cadastro de receitas e gastos
- **✏️ Editar transações existentes** (novo!)
- **🗑️ Confirmação antes de deletar** (novo!)
- **Notas e observações** em cada transação
- **Tags personalizadas** para organização
- **Anexar comprovantes** (fotos/PDFs em base64)
- Máscaras de moeda automáticas (R$ X.XXX,XX)
- Validação completa de dados

### 🔄 Gastos Recorrentes
- **12 templates pré-definidos**: Aluguel, Internet, Luz, Água, Gás, Netflix, Spotify, Academia, Plano de Saúde, Transporte, Condomínio, Celular
- Geração automática mensal
- Configuração de dia de vencimento
- Ativar/desativar recorrentes
- Customização completa

### 🔮 Previsões Inteligentes
- Análise de padrões históricos (últimos 3 meses)
- Projeção de gastos por categoria
- Alertas visuais de orçamento
- Comparação previsto vs real
- Indicadores de status (✅ ⚠️ 🚨)

### 🎯 Metas Financeiras
- Criar metas com valores e prazos
- **🔔 Alertas quando faltam 7 dias** (novo!)
- Acompanhamento de progresso
- Tipos: Economia, Investimento, Compra, Viagem
- Alertas de vencimento
- Preview no dashboard

### 💡 Insights Automáticos
- Análise de comportamento financeiro
- Recomendações personalizadas
- Métricas avançadas:
  - Comprometimento de renda
  - Capacidade de poupança
  - Média diária de gastos
  - Projeção mensal

### 📋 Relatório Imposto de Renda
- Separação automática de receitas tributáveis
- Despesas dedutíveis (Saúde + Educação)
- Seleção de ano fiscal
- Exportação em PDF formatado
- Detalhamento por categoria

### 📜 Histórico Completo
- **🔍 Busca em tempo real** (novo!)
- Listagem de todas transações
- **Botões de editar e deletar** em cada item (novo!)
- Filtros e busca
- Visualização de comprovantes
- Tags e notas visíveis

### ⌨️ Atalhos de Teclado (novo!)
- `ESC` → Fecha modais
- `Ctrl+N` → Nova meta
- `Ctrl+R` → Novo recorrente
- Aumenta produtividade

### 💾 Auto-save (novo!)
- Salva formulários automaticamente
- Recupera dados se fechar sem salvar
- Usa localStorage do navegador

### 🔒 Segurança
- Autenticação com hash SHA-256
- Limite de tentativas de login (5x)
- Bloqueio temporário (5 minutos)
- Sessões seguras (24h)
- Headers de segurança (HSTS, XSS, etc)

### 📤 Exportação
- Backup JSON completo
- Relatórios em PDF
- Dados de Imposto de Renda

## 🛠️ Tecnologias

- **Backend**: Flask 3.0.0 (Python)
- **Banco de Dados**: SQLite
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Design**: Glassmorphism, gradientes, animações CSS
- **Segurança**: SHA-256, rate limiting, secure headers

## 📦 Instalação

```bash
# Clone o repositório
cd controle-financeiro

# Crie o ambiente virtual
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

# Instale as dependências
pip install Flask

# Inicialize o banco de dados
python3 database.py

# Execute o servidor
python3 app.py
```

Acesse: http://127.0.0.1:5000

## 🔑 Credenciais Padrão

- **Usuário**: casal
- **Senha**: Rebily1234

⚠️ **IMPORTANTE**: Altere as credenciais em `app.py` antes de usar em produção!

## 📊 Estrutura do Banco de Dados

### Tabelas Principais
- **receitas**: id, descricao, valor, tipo, data, notas, tags
- **gastos**: id, descricao, valor, categoria, data, notas, tags
- **metas**: id, titulo, valor_alvo, valor_atual, data_inicio, data_fim, tipo, ativo
- **alertas**: id, tipo, mensagem, data, lido
- **recorrentes**: id, descricao, valor, categoria, dia_vencimento, ativo, ultima_geracao
- **comprovantes**: id, transacao_tipo, transacao_id, arquivo_base64, nome_arquivo, data_upload
- **previsoes**: id, categoria, mes_referencia, valor_previsto, valor_real, data_calculo

## 🎨 Categorias

### Receitas
- 💼 Salário
- 💻 Freelance
- 🎫 Cartão Benefício
- 💰 Outras Rendas

### Gastos
- 🍔 Alimentação
- 🚗 Transporte
- 🏠 Moradia
- 💊 Saúde
- 🎮 Lazer
- 📚 Educação
- 📦 Outros

## 🚀 Novidades da Versão 2.2

🐛 **Bug Crítico Corrigido**:
- Gastos recorrentes agora atualizam previsões automaticamente
- Dashboard mostra valores imediatamente após gerar recorrentes

✨ **3 Novas Funcionalidades Incríveis**:

1. **📅 Filtro por Mês**: Visualize transações de um mês específico
2. **🔄 Separação Fixos/Variáveis**: Identifique gastos recorrentes vs variáveis
3. **📊 Resumo Mensal**: Widget no dashboard mostrando fixos, variáveis e total

### 💎 Melhorias Visuais

**Gastos Fixos Destacados:**
- 🔄 Ícone de recorrente
- 🏷️ Badge "FIXO" com gradiente rosa
- 📍 Borda rosa vibrante
- 🎨 Fundo diferenciado
- 📌 Aparecem primeiro na lista

**Filtros Inteligentes:**
- Input de mês estilizado
- Botão "🔄 Todos" para limpar filtros
- Layout responsivo

## 🚀 Novidades da Versão 2.1

✨ **8 Melhorias Surpreendentes**:

1. **✏️ Editar Transações**: Corrija erros sem precisar deletar e recriar
2. **⌨️ Atalhos de Teclado**: Navegue mais rápido (ESC, Ctrl+N, Ctrl+R)
3. **🔍 Busca no Histórico**: Encontre transações instantaneamente
4. **⚠️ Confirmação de Exclusão**: Previne exclusões acidentais
5. **🥧 Gráfico de Pizza**: Visualização circular da distribuição
6. **🔔 Alertas de Metas**: Badge quando faltam 7 dias
7. **✨ Animações**: Cards flutuam ao passar o mouse
8. **💾 Auto-save**: Nunca perca dados de formulários

### 💎 Interface Premium

**Input de Valores Modernizado:**
- Design "Calculadora Premium" com gradiente roxo vibrante
- Ícone SVG elegante com círculo
- Números em fonte moderna
- Display flutuante mostrando valor formatado
- Animação de pulso ao digitar
- Efeito de elevação no foco

**Modais Otimizados:**
- Proporções equilibradas e responsivas
- Fundo branco sólido para melhor contraste
- Campos com texto visível e legível
- Campo de vencimento com número grande e centralizado
- Radio cards com gradiente roxo ao selecionar
- Botão fechar redesenhado com hover vermelho
- Totalmente responsivo (mobile, tablet, desktop)

## 📱 Responsividade

Interface totalmente responsiva, funciona perfeitamente em:
- 💻 Desktop
- 📱 Tablet
- 📱 Mobile

## 🎯 Roadmap Futuro

- [ ] Gráficos interativos (Chart.js)
- [ ] Modo offline (PWA)
- [ ] Multi-usuário
- [ ] Integração bancária (Open Banking)
- [ ] App mobile nativo
- [ ] Relatórios customizáveis

## 📄 Licença

Projeto pessoal - Uso livre

## 👨‍💻 Desenvolvido com ❤️

Sistema criado para facilitar o controle financeiro pessoal com foco em usabilidade e recursos avançados.

---

**Versão**: 2.2.0  
**Data**: Fevereiro 2026
