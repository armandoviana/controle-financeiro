# 💰 Controle Financeiro

Criei esse sistema porque estava cansado de planilhas confusas e apps cheios de anúncios. É simples, direto e faz o que precisa fazer.

## O que tem aqui

Você consegue:
- Ver quanto entra e sai de dinheiro todo mês
- Cadastrar gastos fixos (aluguel, internet, Netflix) que se repetem sozinhos
- Acompanhar se está gastando mais que o normal
- Criar metas pra juntar grana
- Filtrar gastos por mês específico
- Ver gráficos de quanto você gasta em cada categoria
- Exportar e importar dados em Excel

O dashboard mostra tudo de forma visual, com gráficos e cards coloridos. Nada muito complexo, só o necessário pra você não perder o controle.

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

# Cria o banco de dados
python3 database.py

# Roda o servidor
python3 app.py
```

Depois é só abrir http://127.0.0.1:5000 no navegador.

### Primeiro acesso

Você precisa configurar usuário e senha no arquivo `app.py`. Tem uma função `hash_senha()` lá que gera o hash da sua senha. Rode ela uma vez e cole o resultado no código.

## Principais funcionalidades

**Dashboard**: Mostra o resumo do mês - quanto entrou, quanto saiu, quanto sobrou. Tem um "score de saúde financeira" que vai de 0 a 100 baseado no seu saldo. Meio bobo, mas ajuda a ter noção.

**Gastos recorrentes**: Cadastra uma vez coisas como aluguel, Netflix, conta de luz. Todo mês o sistema gera automaticamente. Tem 12 templates prontos, é só clicar e ajustar o valor se precisar.

**Filtro por mês**: Quer ver só os gastos de janeiro? Seleciona o mês e pronto. Os gastos fixos aparecem destacados com uma borda rosa pra você identificar rápido.

**Metas**: Define quanto quer juntar e até quando. O sistema avisa quando está perto do prazo. Útil pra não esquecer aquela viagem que você tá planejando.

**Previsões**: Olha seus gastos dos últimos 3 meses e tenta prever quanto você vai gastar em cada categoria. Não é perfeito, mas dá uma ideia.

**Relatório de IR**: Separa receitas e despesas dedutíveis (saúde e educação) pra facilitar na hora de declarar imposto. Economiza um tempo danado.

**Excel**: Exporta tudo pra Excel se você quiser fazer suas próprias análises. E também importa, caso você tenha dados em planilha.

## Mobile

Funciona bem no celular. O menu fica embaixo, igual apps tipo Instagram ou WhatsApp. Testei no iPhone e Android, roda tranquilo. Dá pra adicionar na tela inicial e usar como se fosse um app.

## Tecnologias

Usei Flask porque é simples e direto. O banco é SQLite - um arquivo só, fácil de fazer backup. O frontend é HTML, CSS e JavaScript puro, sem frameworks pesados que deixam tudo lento.

O visual tem uns efeitos de vidro (glassmorphism) e gradientes roxos. Achei bonito e moderno sem ser exagerado.

## Segurança

Tem login com senha (hash SHA-256), limite de tentativas, e uns headers de segurança básicos. Nada super avançado tipo banco, mas protege o essencial pra uso pessoal.

## Ideias futuras

Talvez eu adicione:
- Gráficos mais interativos
- Modo offline completo (PWA)
- Integração com banco (Open Banking)
- Notificações push

Mas por enquanto está funcionando bem do jeito que está. Prefiro manter simples.

## Licença

Fique à vontade pra usar, modificar, o que quiser. É um projeto pessoal que resolvi compartilhar. Se ajudar alguém, já valeu.
