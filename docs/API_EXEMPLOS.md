# 🔌 API - Exemplos de Uso

## Novo Endpoint: `/api/gastos/mes`

### Descrição
Retorna gastos de um mês específico, ordenados por tipo (fixos primeiro) e data.

### Método
`GET`

### Parâmetros
- `mes` (opcional): Mês no formato `YYYY-MM`. Padrão: mês atual

### Resposta
```json
[
  {
    "id": 1,
    "descricao": "Aluguel",
    "valor": 1500.00,
    "categoria": "Moradia",
    "data": "2026-02-05",
    "notas": "",
    "tags": "recorrente",
    "eh_recorrente": 1
  },
  {
    "id": 2,
    "descricao": "Supermercado",
    "valor": 350.00,
    "categoria": "Alimentação",
    "data": "2026-02-15",
    "notas": "Compras do mês",
    "tags": "",
    "eh_recorrente": 0
  }
]
```

### Exemplos de Uso

#### JavaScript (Fetch)
```javascript
// Buscar gastos do mês atual
const gastos = await fetch('/api/gastos/mes').then(r => r.json());

// Buscar gastos de fevereiro de 2026
const gastosFev = await fetch('/api/gastos/mes?mes=2026-02').then(r => r.json());

// Separar fixos e variáveis
const fixos = gastos.filter(g => g.eh_recorrente === 1);
const variaveis = gastos.filter(g => g.eh_recorrente === 0);

// Calcular totais
const totalFixos = fixos.reduce((sum, g) => sum + g.valor, 0);
const totalVariaveis = variaveis.reduce((sum, g) => sum + g.valor, 0);
```

#### cURL
```bash
# Mês atual
curl http://127.0.0.1:5000/api/gastos/mes

# Mês específico
curl http://127.0.0.1:5000/api/gastos/mes?mes=2026-02

# Com autenticação (se necessário)
curl -H "Cookie: session=..." http://127.0.0.1:5000/api/gastos/mes
```

#### Python (requests)
```python
import requests

# Mês atual
response = requests.get('http://127.0.0.1:5000/api/gastos/mes')
gastos = response.json()

# Mês específico
response = requests.get('http://127.0.0.1:5000/api/gastos/mes', params={'mes': '2026-02'})
gastos_fev = response.json()

# Separar fixos e variáveis
fixos = [g for g in gastos if g['eh_recorrente'] == 1]
variaveis = [g for g in gastos if g['eh_recorrente'] == 0]

# Calcular totais
total_fixos = sum(g['valor'] for g in fixos)
total_variaveis = sum(g['valor'] for g in variaveis)

print(f"Fixos: R$ {total_fixos:.2f}")
print(f"Variáveis: R$ {total_variaveis:.2f}")
```

## Endpoints Existentes (Referência)

### `GET /api/receitas`
Retorna todas as receitas.

### `POST /api/receitas`
Cria uma nova receita.
```json
{
  "descricao": "Salário",
  "valor": 5000.00,
  "tipo": "Salário",
  "data": "2026-02-01",
  "notas": "Salário de fevereiro",
  "tags": ""
}
```

### `GET /api/gastos`
Retorna todos os gastos.

### `POST /api/gastos`
Cria um novo gasto.
```json
{
  "descricao": "Supermercado",
  "valor": 350.00,
  "categoria": "Alimentação",
  "data": "2026-02-15",
  "notas": "Compras do mês",
  "tags": ""
}
```

### `GET /api/resumo`
Retorna resumo financeiro.
```json
{
  "receitas": 5000.00,
  "gastos": 2500.00,
  "saldo": 2500.00
}
```

### `GET /api/previsoes`
Retorna previsões por categoria.
```json
[
  {
    "categoria": "Alimentação",
    "previsto": 800.00,
    "real": 750.00,
    "percentual": 93.8
  }
]
```

### `POST /api/recorrentes/gerar`
Gera gastos recorrentes do mês atual.
```json
{
  "success": true,
  "gerados": 5
}
```

## Casos de Uso

### 1. Dashboard Personalizado
```javascript
async function carregarDashboard() {
    const [resumo, gastosMes] = await Promise.all([
        fetch('/api/resumo').then(r => r.json()),
        fetch('/api/gastos/mes').then(r => r.json())
    ]);
    
    const fixos = gastosMes.filter(g => g.eh_recorrente === 1);
    const variaveis = gastosMes.filter(g => g.eh_recorrente === 0);
    
    const totalFixos = fixos.reduce((sum, g) => sum + g.valor, 0);
    const totalVariaveis = variaveis.reduce((sum, g) => sum + g.valor, 0);
    
    console.log('Resumo:', resumo);
    console.log('Fixos:', totalFixos);
    console.log('Variáveis:', totalVariaveis);
}
```

### 2. Comparação Mensal
```javascript
async function compararMeses(mes1, mes2) {
    const [gastos1, gastos2] = await Promise.all([
        fetch(`/api/gastos/mes?mes=${mes1}`).then(r => r.json()),
        fetch(`/api/gastos/mes?mes=${mes2}`).then(r => r.json())
    ]);
    
    const total1 = gastos1.reduce((sum, g) => sum + g.valor, 0);
    const total2 = gastos2.reduce((sum, g) => sum + g.valor, 0);
    
    const diferenca = total2 - total1;
    const percentual = ((diferenca / total1) * 100).toFixed(1);
    
    console.log(`${mes1}: R$ ${total1.toFixed(2)}`);
    console.log(`${mes2}: R$ ${total2.toFixed(2)}`);
    console.log(`Diferença: R$ ${diferenca.toFixed(2)} (${percentual}%)`);
}

// Exemplo: comparar janeiro e fevereiro
compararMeses('2026-01', '2026-02');
```

### 3. Análise de Categorias
```javascript
async function analisarCategorias(mes) {
    const gastos = await fetch(`/api/gastos/mes?mes=${mes}`).then(r => r.json());
    
    const porCategoria = gastos.reduce((acc, g) => {
        if (!acc[g.categoria]) {
            acc[g.categoria] = { total: 0, fixos: 0, variaveis: 0 };
        }
        acc[g.categoria].total += g.valor;
        if (g.eh_recorrente) {
            acc[g.categoria].fixos += g.valor;
        } else {
            acc[g.categoria].variaveis += g.valor;
        }
        return acc;
    }, {});
    
    console.log('Análise por categoria:', porCategoria);
}

// Exemplo: analisar fevereiro
analisarCategorias('2026-02');
```

### 4. Exportar Dados
```javascript
async function exportarMes(mes) {
    const [receitas, gastos] = await Promise.all([
        fetch('/api/receitas').then(r => r.json()),
        fetch(`/api/gastos/mes?mes=${mes}`).then(r => r.json())
    ]);
    
    const receitasMes = receitas.filter(r => r.data.startsWith(mes));
    
    const dados = {
        mes: mes,
        receitas: receitasMes,
        gastos: gastos,
        resumo: {
            totalReceitas: receitasMes.reduce((sum, r) => sum + r.valor, 0),
            totalGastos: gastos.reduce((sum, g) => sum + g.valor, 0),
            gastosFixos: gastos.filter(g => g.eh_recorrente).reduce((sum, g) => sum + g.valor, 0),
            gastosVariaveis: gastos.filter(g => !g.eh_recorrente).reduce((sum, g) => sum + g.valor, 0)
        }
    };
    
    // Baixar como JSON
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financas_${mes}.json`;
    a.click();
}

// Exemplo: exportar fevereiro
exportarMes('2026-02');
```

## Integração com Outras Ferramentas

### Google Sheets (Apps Script)
```javascript
function importarGastos() {
  const mes = '2026-02';
  const url = `http://127.0.0.1:5000/api/gastos/mes?mes=${mes}`;
  
  const response = UrlFetchApp.fetch(url);
  const gastos = JSON.parse(response.getContentText());
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clear();
  sheet.appendRow(['Descrição', 'Valor', 'Categoria', 'Data', 'Tipo']);
  
  gastos.forEach(g => {
    sheet.appendRow([
      g.descricao,
      g.valor,
      g.categoria,
      g.data,
      g.eh_recorrente ? 'Fixo' : 'Variável'
    ]);
  });
}
```

### Power BI / Tableau
Use o endpoint como fonte de dados JSON:
```
http://127.0.0.1:5000/api/gastos/mes?mes=2026-02
```

### Excel (Power Query)
```m
let
    Fonte = Json.Document(Web.Contents("http://127.0.0.1:5000/api/gastos/mes?mes=2026-02")),
    Tabela = Table.FromList(Fonte, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    Expandido = Table.ExpandRecordColumn(Tabela, "Column1", {"descricao", "valor", "categoria", "data", "eh_recorrente"})
in
    Expandido
```

## Segurança

⚠️ **IMPORTANTE**: Todos os endpoints requerem autenticação via sessão.

Para testar localmente sem autenticação, remova o decorator `@login_required` temporariamente:
```python
# app.py
# @login_required  # ← Comentar para testes
def gastos_por_mes():
    # ...
```

**Nunca faça isso em produção!**

## Rate Limiting

Atualmente não há rate limiting. Para adicionar:
```python
from flask_limiter import Limiter

limiter = Limiter(app, key_func=lambda: request.remote_addr)

@app.route('/api/gastos/mes')
@limiter.limit("100 per minute")
@login_required
def gastos_por_mes():
    # ...
```

## CORS (para apps externos)

Para permitir requisições de outros domínios:
```python
from flask_cors import CORS

CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
```

---

**Documentação completa**: Veja `CHANGELOG_v2.2.md` e `GUIA_RAPIDO.md`
