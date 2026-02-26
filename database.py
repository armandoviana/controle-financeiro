import os
import sqlite3

def get_db_connection():
    """Retorna conexão com banco de dados (SQLite ou PostgreSQL)"""
    database_url = os.environ.get('DATABASE_URL')
    
    if database_url:
        # PostgreSQL (produção)
        import psycopg2
        import psycopg2.extras
        
        # Render usa postgres://, mas psycopg2 precisa de postgresql://
        if database_url.startswith('postgres://'):
            database_url = database_url.replace('postgres://', 'postgresql://', 1)
        
        conn = psycopg2.connect(database_url, cursor_factory=psycopg2.extras.RealDictCursor)
        return conn, 'postgresql'
    else:
        # SQLite (local)
        conn = sqlite3.connect('financas.db')
        conn.row_factory = sqlite3.Row
        return conn, 'sqlite'

def init_db():
    conn, db_type = get_db_connection()
    cursor = conn.cursor()
    
    # Ajusta sintaxe SQL conforme banco
    if db_type == 'postgresql':
        autoincrement = 'SERIAL PRIMARY KEY'
        integer_type = 'INTEGER'
        real_type = 'REAL'
        text_type = 'TEXT'
    else:
        autoincrement = 'INTEGER PRIMARY KEY AUTOINCREMENT'
        integer_type = 'INTEGER'
        real_type = 'REAL'
        text_type = 'TEXT'
    
    # Tabelas
    tables = [
        f'''CREATE TABLE IF NOT EXISTS receitas (
            id {autoincrement},
            descricao {text_type} NOT NULL,
            valor {real_type} NOT NULL,
            tipo {text_type} NOT NULL,
            data {text_type} NOT NULL,
            notas {text_type},
            tags {text_type}
        )''',
        
        f'''CREATE TABLE IF NOT EXISTS gastos (
            id {autoincrement},
            descricao {text_type} NOT NULL,
            valor {real_type} NOT NULL,
            categoria {text_type} NOT NULL,
            data {text_type} NOT NULL,
            notas {text_type},
            tags {text_type}
        )''',
        
        f'''CREATE TABLE IF NOT EXISTS metas (
            id {autoincrement},
            titulo {text_type} NOT NULL,
            valor_alvo {real_type} NOT NULL,
            valor_atual {real_type} DEFAULT 0,
            data_inicio {text_type} NOT NULL,
            data_fim {text_type} NOT NULL,
            tipo {text_type} NOT NULL,
            ativo {integer_type} DEFAULT 1
        )''',
        
        f'''CREATE TABLE IF NOT EXISTS alertas (
            id {autoincrement},
            tipo {text_type} NOT NULL,
            mensagem {text_type} NOT NULL,
            data {text_type} NOT NULL,
            lido {integer_type} DEFAULT 0
        )''',
        
        f'''CREATE TABLE IF NOT EXISTS comprovantes (
            id {autoincrement},
            transacao_tipo {text_type} NOT NULL,
            transacao_id {integer_type} NOT NULL,
            arquivo_base64 {text_type} NOT NULL,
            nome_arquivo {text_type},
            data_upload {text_type} NOT NULL
        )''',
        
        f'''CREATE TABLE IF NOT EXISTS recorrentes (
            id {autoincrement},
            descricao {text_type} NOT NULL,
            valor {real_type} NOT NULL,
            categoria {text_type} NOT NULL,
            dia_vencimento {integer_type} NOT NULL,
            ativo {integer_type} DEFAULT 1,
            ultima_geracao {text_type}
        )''',
        
        f'''CREATE TABLE IF NOT EXISTS previsoes (
            id {autoincrement},
            categoria {text_type} NOT NULL,
            mes_referencia {text_type} NOT NULL,
            valor_previsto {real_type} NOT NULL,
            valor_real {real_type} DEFAULT 0,
            data_calculo {text_type} NOT NULL
        )'''
    ]
    
    for table_sql in tables:
        cursor.execute(table_sql)
    
    conn.commit()
    conn.close()
    
    print(f'✅ Banco de dados criado! (Tipo: {db_type})')

if __name__ == '__main__':
    init_db()
