# 💰 Controle Financeiro

Um jeito simples de organizar suas finanças. Criei esse sistema porque estava cansado de planilhas complicadas e apps cheios de propaganda.

## O que ele faz

Basicamente, você consegue:
- Ver quanto entra e sai de dinheiro todo mês
- Cadastrar gastos fixos (tipo aluguel, internet) que se repetem sozinhos
- Acompanhar se está gastando mais que o normal
- Criar metas pra juntar grana
- Filtrar gastos por mês
- Ver quanto você gasta em cada categoria

Tem um dashboard que mostra tudo de forma visual, com gráficos e uns cards coloridos. Nada muito complexo, só o necessário.

## Como usar

### Instalação local

```bash
# Baixa o projeto
git clone https://github.com/armandoviana/controle-financeiro.git
cd controle-financeiro

# Cria ambiente virtual
python3 -m venv venv
source venv/bin/activate

# Instala o Flask
pip install Flask

# Cria o banco de dados
python3 database.py

# Roda o servidor
python3 app.py
```

Depois é só abrir http://127.0.0.1:5000 no navegador.

### Primeiro acesso

Você vai precisar configurar um usuário e senha no arquivo `app.py`. Tem uma função lá chamada `hash_senha()` que gera o hash da sua senha. É só rodar ela uma vez e colar o resultado no código.

## Funcionalidades principais

**Dashboard**: Mostra o resumo do mês - quanto entrou, quanto saiu, quanto sobrou. Tem um "score de saúde financeira" que vai de 0 a 100 baseado no seu saldo.

**Gastos recorrentes**: Cadastra uma vez coisas como aluguel, Netflix, conta de luz. Todo mês o sistema gera automaticamente pra você. Tem 12 templates prontos, é só clicar e ajustar o valor.

**Filtro por mês**: Quer ver só os gastos de janeiro? Seleciona o mês e pronto. Os gastos fixos aparecem destacados com uma borda rosa.

**Metas**: Define quanto quer juntar e até quando. O sistema avisa quando está perto do prazo.

**Previsões**: Olha seus gastos dos últimos 3 meses e tenta prever quanto você vai gastar em cada categoria. Útil pra não estourar o orçamento.

**Relatório de IR**: Separa receitas e despesas dedutíveis (saúde e educação) pra facilitar na hora de declarar imposto.

## Mobile

Funciona bem no celular. O menu fica embaixo, igual apps tipo Instagram. Testei no iPhone e Android, roda tranquilo.

## Tecnologias

Usei Flask porque é simples e direto. O banco é SQLite (um arquivo só, fácil de fazer backup). O frontend é HTML, CSS e JavaScript puro, sem frameworks pesados.

O visual tem uns efeitos de vidro (glassmorphism) e gradientes roxos. Achei bonito e moderno sem ser exagerado.

## Segurança

Tem login com senha (hash SHA-256), limite de tentativas, e uns headers de segurança básicos. Nada super avançado, mas protege o essencial.

## Próximas ideias

Talvez eu adicione:
- Gráficos mais interativos
- Modo offline
- Integração com banco (Open Banking)
- Exportar relatórios em Excel

Mas por enquanto está funcionando bem do jeito que está.

## Licença

Fique à vontade pra usar, modificar, o que quiser. É um projeto pessoal que resolvi compartilhar.
