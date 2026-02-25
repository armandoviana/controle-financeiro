# 🚀 Controle Financeiro - Versão 2.2

## 🐛 Correções de Bugs

### Bug Crítico Corrigido: Gastos Recorrentes
**Problema**: Quando um gasto recorrente era gerado, ele não atualizava as previsões nem aparecia imediatamente no dashboard.

**Solução**: 
- Modificado `gerarRecorrentes()` em `static/script-extras.js` para chamar `await carregarPrevisoes()` após gerar os gastos
- Agora os gastos recorrentes aparecem instantaneamente no dashboard e as previsões são recalculadas

## ✨ Novas Funcionalidades

### 1. 📅 Filtro por Mês no Histórico
Agora você pode visualizar transações de um mês específico!

**Como usar**:
- Vá para a página "Histórico"
- Selecione o mês desejado no campo de data
- Clique em "🔄 Todos" para voltar à visualização completa

**Implementação**:
- Novo endpoint: `GET /api/gastos/mes?mes=YYYY-MM`
- Retorna gastos do mês com flag `eh_recorrente`
- Filtro de receitas por mês no frontend

### 2. 🔄 Separação de Gastos Fixos e Variáveis

**No Histórico**:
- Gastos fixos (recorrentes) aparecem com:
  - Ícone 🔄 no início
  - Badge "FIXO" em destaque
  - Borda rosa à esquerda
  - Fundo com gradiente rosa suave
- Contador separado: "X fixos" ao lado de "X itens"
- Gastos fixos aparecem primeiro na lista

**No Dashboard**:
- Novo widget "📅 Resumo do Mês" mostrando:
  - 💸 Gastos Fixos: R$ X,XX
  - 🛒 Gastos Variáveis: R$ X,XX
  - 📊 Total do Mês: R$ X,XX

### 3. 🎨 Melhorias Visuais

**Gastos Fixos**:
- Borda rosa vibrante (#f093fb → #f5576c)
- Fundo com gradiente rosa transparente
- Badge "FIXO" com gradiente rosa

**Filtros**:
- Input de mês estilizado com hover e focus
- Botão "🔄 Todos" com gradiente roxo
- Layout responsivo com flex-wrap

## 📝 Arquivos Modificados

### Backend (Python)
- `app.py`:
  - Novo endpoint `/api/gastos/mes` para buscar gastos por mês
  - Query SQL otimizada com flag `eh_recorrente`

### Frontend (JavaScript)
- `static/script-extras.js`:
  - `gerarRecorrentes()`: Corrigido para atualizar previsões
  - `filtrarPorMes()`: Nova função para filtrar por mês
  - `limparFiltroMes()`: Limpa filtros e recarrega tudo
  - `atualizarListaHistorico()`: Renderiza com separação fixos/variáveis
  - `criarItemGasto()`: Cria HTML com estilo diferenciado para fixos
  - `calcularResumoMensal()`: Calcula totais de fixos e variáveis

- `static/script.js`:
  - `carregarDados()`: Atualizado para chamar `calcularResumoMensal()`
  - Integração com nova função `atualizarListaHistorico()`

### Frontend (HTML)
- `templates/index.html`:
  - Adicionado filtro de mês no histórico
  - Contador de gastos fixos
  - Novo widget "Resumo do Mês" no dashboard

### Frontend (CSS)
- `static/style.css`:
  - `.item-fixo`: Estilo para gastos recorrentes
  - `.badge-fixo`: Badge "FIXO" com gradiente
  - `.input-mes-filtro`: Input de mês estilizado
  - `.btn-filtro`: Botão de limpar filtro
  - `.resumo-mensal`: Widget de resumo mensal
  - `.resumo-item`: Itens do resumo com hover

## 🎯 Como Usar as Novas Funcionalidades

### Visualizar Gastos por Mês
1. Acesse "📜 Histórico"
2. Selecione o mês no campo de data
3. Veja apenas as transações daquele mês
4. Clique em "🔄 Todos" para ver tudo novamente

### Identificar Gastos Fixos
1. Gastos recorrentes aparecem com:
   - Ícone 🔄
   - Badge "FIXO"
   - Borda rosa
2. No dashboard, veja o resumo separado:
   - Fixos vs Variáveis
   - Total do mês

### Gerar Gastos Recorrentes
1. Acesse "🔄 Recorrentes"
2. Clique em "⚡ Gerar Gastos do Mês"
3. Agora as previsões são atualizadas automaticamente!
4. Dashboard mostra os valores imediatamente

## 🔧 Detalhes Técnicos

### Endpoint `/api/gastos/mes`
```python
@app.route('/api/gastos/mes')
@login_required
def gastos_por_mes():
    mes = request.args.get('mes', datetime.now().strftime('%Y-%m'))
    gastos = conn.execute('''
        SELECT *, 
        CASE WHEN tags LIKE '%recorrente%' THEN 1 ELSE 0 END as eh_recorrente
        FROM gastos 
        WHERE strftime('%Y-%m', data) = ?
        ORDER BY eh_recorrente DESC, data DESC
    ''', (mes,)).fetchall()
    return jsonify([dict(g) for g in gastos])
```

### Identificação de Gastos Fixos
- Tag `recorrente` é adicionada automaticamente ao gerar gastos recorrentes
- Query SQL usa `CASE WHEN tags LIKE '%recorrente%'` para flag
- Frontend filtra com `g.tags && g.tags.includes('recorrente')`

### Cache Global
```javascript
let gastosCacheGlobal = [];
let receitasCacheGlobal = [];
```
Armazena dados para filtros rápidos sem requisições extras.

## 📊 Benefícios

✅ **Organização**: Separe gastos fixos de variáveis facilmente  
✅ **Visibilidade**: Veja quanto gasta em cada categoria por mês  
✅ **Planejamento**: Identifique onde pode economizar (variáveis)  
✅ **Controle**: Acompanhe se gastos fixos estão aumentando  
✅ **Histórico**: Navegue por meses anteriores rapidamente  

## 🐛 Bugs Conhecidos
Nenhum bug conhecido nesta versão.

## 🚀 Próximas Melhorias Sugeridas
- [ ] Gráfico de evolução de gastos fixos vs variáveis
- [ ] Exportar relatório mensal em PDF
- [ ] Comparar meses (ex: fev vs jan)
- [ ] Alertas quando gastos variáveis ultrapassam média
- [ ] Sugestões de economia baseadas em padrões

---

**Versão**: 2.2.0  
**Data**: 24 de Fevereiro de 2026  
**Desenvolvido com**: Flask, SQLite, JavaScript Vanilla
