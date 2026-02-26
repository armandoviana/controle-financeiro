import re

with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Padrão para encontrar rotas API
pattern = r"(@app\.route\('/api/[^']+'.+?\n@login_required\ndef \w+\(\):)"

def add_try_catch(match):
    route_def = match.group(1)
    return route_def + "\n    try:"

# Adiciona try no início de cada rota
content_modified = re.sub(pattern, add_try_catch, content)

# Agora adiciona except no final de cada função de rota
# Encontra o padrão: conn.close()\n    return jsonify
content_modified = re.sub(
    r'(conn\.close\(\)\s+return jsonify\([^)]+\))',
    r'\1\n    except Exception as e:\n        print(f"❌ Erro: {e}")\n        return jsonify({"success": False, "message": str(e)}), 500',
    content_modified
)

with open('app.py', 'w', encoding='utf-8') as f:
    f.write(content_modified)

print("✅ Try-catch adicionado em todas as rotas!")
