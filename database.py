import sqlite3

def init_db():
    conn = sqlite3.connect('financas.db')
    c = conn.cursor()
    
    c.execute('''CREATE TABLE IF NOT EXISTS receitas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        descricao TEXT NOT NULL,
        valor REAL NOT NULL,
        tipo TEXT NOT NULL,
        data TEXT NOT NULL,
        notas TEXT,
        tags TEXT
    )''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS gastos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        descricao TEXT NOT NULL,
        valor REAL NOT NULL,
        categoria TEXT NOT NULL,
        data TEXT NOT NULL,
        notas TEXT,
        tags TEXT
    )''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS metas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        valor_alvo REAL NOT NULL,
        valor_atual REAL DEFAULT 0,
        data_inicio TEXT NOT NULL,
        data_fim TEXT NOT NULL,
        tipo TEXT NOT NULL,
        ativo INTEGER DEFAULT 1
    )''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS alertas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT NOT NULL,
        mensagem TEXT NOT NULL,
        data TEXT NOT NULL,
        lido INTEGER DEFAULT 0
    )''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS comprovantes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transacao_tipo TEXT NOT NULL,
        transacao_id INTEGER NOT NULL,
        arquivo_base64 TEXT NOT NULL,
        nome_arquivo TEXT,
        data_upload TEXT NOT NULL
    )''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS recorrentes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        descricao TEXT NOT NULL,
        valor REAL NOT NULL,
        categoria TEXT NOT NULL,
        dia_vencimento INTEGER NOT NULL,
        ativo INTEGER DEFAULT 1,
        ultima_geracao TEXT
    )''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS previsoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        categoria TEXT NOT NULL,
        mes_referencia TEXT NOT NULL,
        valor_previsto REAL NOT NULL,
        valor_real REAL DEFAULT 0,
        data_calculo TEXT NOT NULL
    )''')
    
    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print('Banco de dados criado!')
