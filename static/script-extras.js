// Adicionar ao final do arquivo script.js existente

// METAS
window.abrirModalMeta = function() {
    console.log('Abrindo modal meta');
    const modal = document.getElementById('modal-meta');
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
        const hoje = new Date().toISOString().split('T')[0];
        const dataInicio = document.getElementById('meta-data-inicio');
        if (dataInicio) dataInicio.value = hoje;
    } else {
        console.error('Modal meta não encontrado');
    }
}

window.fecharModalMeta = function() {
    const modal = document.getElementById('modal-meta');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        const form = document.getElementById('form-meta');
        if (form) form.reset();
    }
}

document.getElementById('form-meta')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validações
    const titulo = document.getElementById('meta-titulo').value;
    if (!validarCampoTexto(titulo, 'Título da meta')) return;
    
    const valorAlvo = parseFloat(document.getElementById('meta-valor-alvo').value);
    if (isNaN(valorAlvo) || valorAlvo <= 0) {
        mostrarErro('Valor alvo deve ser maior que zero');
        return;
    }
    
    const valorAtual = parseFloat(document.getElementById('meta-valor-atual').value);
    if (isNaN(valorAtual) || valorAtual < 0) {
        mostrarErro('Valor atual não pode ser negativo');
        return;
    }
    
    if (valorAtual > valorAlvo) {
        mostrarAviso('Valor atual é maior que a meta');
    }
    
    const dataInicio = document.getElementById('meta-data-inicio').value;
    const dataFim = document.getElementById('meta-data-fim').value;
    
    if (!validarData(dataInicio, 'Data de início')) return;
    if (!validarData(dataFim, 'Data de fim')) return;
    
    if (new Date(dataFim) <= new Date(dataInicio)) {
        mostrarErro('Data de fim deve ser posterior à data de início');
        return;
    }
    
    const tipo = document.getElementById('meta-tipo').value;
    if (!tipo) {
        mostrarErro('Selecione o tipo da meta');
        return;
    }
    
    try {
        const response = await fetch('/api/metas', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                titulo: titulo.trim(),
                valor_alvo: valorAlvo,
                valor_atual: valorAtual,
                data_inicio: dataInicio,
                data_fim: dataFim,
                tipo: tipo
            })
        });
        
        if (!response.ok) {
            throw new Error('Erro ao criar meta');
        }
        
        fecharModalMeta();
        carregarMetas();
        mostrarNotificacao('🎯 Meta criada com sucesso!', 'success');
    } catch (error) {
        console.error('Erro:', error);
        mostrarErro('Erro ao criar meta. Tente novamente.');
    }
});

async function carregarMetas() {
    try {
        const metas = await fetch('/api/metas').then(r => r.json());
        
        if (!Array.isArray(metas)) {
            console.error('Dados de metas inválidos');
            return;
        }
        
        // Atualizar página de metas
        const container = document.getElementById('metas-container');
        if (container) {
            if (metas.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 60px;">Nenhuma meta cadastrada. Crie sua primeira meta!</p>';
            } else {
                container.innerHTML = metas.map(meta => {
                    try {
                        const progresso = Math.min(100, Math.max(0, (meta.valor_atual / meta.valor_alvo * 100).toFixed(0)));
                        const diasRestantes = Math.ceil((new Date(meta.data_fim) - new Date()) / (1000 * 60 * 60 * 24));
                        
                        const tipoIcons = {
                            'economia': '💰',
                            'investimento': '📈',
                            'compra': '🛍️',
                            'viagem': '✈️',
                            'outro': '📌'
                        };
                        
                        return `
                            <div class="meta-card">
                                <div class="meta-header">
                                    <div class="meta-titulo">${tipoIcons[meta.tipo] || '📌'} ${meta.titulo || 'Sem título'}</div>
                                    <div class="meta-tipo-badge">${meta.tipo || 'outro'}</div>
                                </div>
                                <div class="meta-valores">
                                    <div class="meta-valor-linha">
                                        <span>Atual:</span>
                                        <span>${formatarMoeda(meta.valor_atual || 0)}</span>
                                    </div>
                                    <div class="meta-valor-linha">
                                        <span>Meta:</span>
                                        <span>${formatarMoeda(meta.valor_alvo || 0)}</span>
                                    </div>
                                    <div class="meta-valor-linha">
                                        <span>Falta:</span>
                                        <span>${formatarMoeda(Math.max(0, (meta.valor_alvo || 0) - (meta.valor_atual || 0)))}</span>
                                    </div>
                                </div>
                                <div class="meta-progresso-barra">
                                    <div class="meta-progresso-fill" style="width: ${progresso}%">
                                        ${progresso}%
                                    </div>
                                </div>
                                <div class="meta-footer">
                                    <div class="meta-prazo">
                                        ${diasRestantes > 0 ? `📅 ${diasRestantes} dias restantes` : '⏰ Prazo expirado'}
                                    </div>
                                    <div class="meta-acoes">
                                        <button class="btn-meta-acao" onclick="atualizarMeta(${meta.id})" title="Atualizar">💰</button>
                                        <button class="btn-meta-acao" onclick="excluirMeta(${meta.id})" title="Excluir">🗑️</button>
                                    </div>
                                </div>
                            </div>
                        `;
                    } catch (error) {
                        console.error('Erro ao renderizar meta:', error);
                        return '';
                    }
                }).join('');
            }
        }
        
        // Atualizar preview no dashboard
        const preview = document.getElementById('metas-preview-container');
        if (preview) {
            const metasAtivas = metas.slice(0, 3);
            if (metasAtivas.length === 0) {
                preview.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 20px;">Nenhuma meta ativa</p>';
            } else {
                preview.innerHTML = metasAtivas.map(meta => {
                    try {
                        const progresso = Math.min(100, Math.max(0, (meta.valor_atual / meta.valor_alvo * 100).toFixed(0)));
                        const tipoIcons = {
                            'economia': '💰',
                            'investimento': '📈',
                            'compra': '🛍️',
                            'viagem': '✈️',
                            'outro': '📌'
                        };
                        
                        return `
                            <div class="meta-preview-item">
                                <div class="meta-preview-header">
                                    <span>${tipoIcons[meta.tipo] || '📌'} ${meta.titulo || 'Sem título'}</span>
                                    <span style="font-weight: 600;">${progresso}%</span>
                                </div>
                                <div class="meta-preview-barra">
                                    <div class="meta-preview-fill" style="width: ${progresso}%"></div>
                                </div>
                                <div class="meta-preview-valores">
                                    <span style="font-size: 0.85em; color: var(--text-light);">
                                        ${formatarMoeda(meta.valor_atual || 0)} de ${formatarMoeda(meta.valor_alvo || 0)}
                                    </span>
                                </div>
                            </div>
                        `;
                    } catch (error) {
                        console.error('Erro ao renderizar preview de meta:', error);
                        return '';
                    }
                }).join('');
            }
        }
    } catch (error) {
        console.error('Erro ao carregar metas:', error);
        const container = document.getElementById('metas-container');
        if (container) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 40px;">Erro ao carregar metas</p>';
        }
        const preview = document.getElementById('metas-preview-container');
        if (preview) {
            preview.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 20px;">Erro ao carregar</p>';
        }
    }
}

async function atualizarMeta(id) {
    const novoValor = prompt('Digite o novo valor atual:');
    if (!novoValor) return;
    
    const valor = parseFloat(novoValor.replace(',', '.'));
    
    if (isNaN(valor) || valor < 0) {
        mostrarErro('Valor inválido. Digite um número positivo.');
        return;
    }
    
    if (valor > 999999999) {
        mostrarErro('Valor muito alto');
        return;
    }
    
    try {
        const response = await fetch('/api/metas', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id, valor_atual: valor })
        });
        
        if (!response.ok) {
            throw new Error('Erro ao atualizar meta');
        }
        
        carregarMetas();
        mostrarNotificacao('✅ Meta atualizada!', 'success');
    } catch (error) {
        console.error('Erro:', error);
        mostrarErro('Erro ao atualizar meta. Tente novamente.');
    }
}

async function excluirMeta(id) {
    if (!confirm('Deseja realmente excluir esta meta?')) return;
    
    try {
        const response = await fetch(`/api/metas?id=${id}`, { method: 'DELETE' });
        
        if (!response.ok) {
            throw new Error('Erro ao excluir meta');
        }
        
        carregarMetas();
        mostrarNotificacao('🗑️ Meta excluída!', 'success');
    } catch (error) {
        console.error('Erro:', error);
        mostrarErro('Erro ao excluir meta. Tente novamente.');
    }
}

// COMPARAÇÃO MENSAL
async function carregarComparacao() {
    try {
        const comp = await fetch('/api/comparacao').then(r => r.json());
        
        if (!comp) {
            throw new Error('Dados de comparação inválidos');
        }
        
        const container = document.getElementById('comparacao-container');
        if (!container) return;
        
        // Validar valores
        const mesAtual = parseFloat(comp.mes_atual) || 0;
        const mesAnterior = parseFloat(comp.mes_anterior) || 0;
        const media3Meses = parseFloat(comp.media_3_meses) || 0;
        const variacao = parseFloat(comp.variacao_percentual) || 0;
        
        const variacaoClass = variacao >= 0 ? 'negativa' : 'positiva';
        const variacaoIcon = variacao >= 0 ? '📈' : '📉';
        
        container.innerHTML = `
            <div class="comparacao-item">
                <div class="comparacao-label">Mês Atual</div>
                <div class="comparacao-valor">${formatarMoeda(mesAtual)}</div>
            </div>
            <div class="comparacao-item">
                <div class="comparacao-label">Mês Anterior</div>
                <div class="comparacao-valor">${formatarMoeda(mesAnterior)}</div>
            </div>
            <div class="comparacao-item">
                <div class="comparacao-label">Variação</div>
                <div>
                    <span class="variacao ${variacaoClass}">
                        ${variacaoIcon} ${Math.abs(variacao).toFixed(1)}%
                    </span>
                </div>
            </div>
            <div class="comparacao-item">
                <div class="comparacao-label">Média 3 meses</div>
                <div class="comparacao-valor">${formatarMoeda(media3Meses)}</div>
            </div>
        `;
    } catch (error) {
        console.error('Erro ao carregar comparação:', error);
        const container = document.getElementById('comparacao-container');
        if (container) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 20px;">Erro ao carregar</p>';
        }
    }
}

// GRÁFICO DE EVOLUÇÃO
async function carregarGraficoEvolucao() {
    try {
        const canvas = document.getElementById('chart-evolucao');
        if (!canvas) return;
        
        const evolucao = await fetch('/api/evolucao').then(r => r.json());
        
        // Validar dados
        if (!evolucao || !evolucao.receitas || !evolucao.gastos) {
            canvas.parentElement.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 40px;">Erro ao carregar dados</p>';
            return;
        }
        
        if (!evolucao.receitas.length && !evolucao.gastos.length) {
            canvas.parentElement.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 40px;">Sem dados para exibir</p>';
            return;
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = Math.max(300, rect.width - 60);
        canvas.height = 250;
        
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        // Preparar dados
        const meses = [...new Set([...evolucao.receitas.map(r => r.mes), ...evolucao.gastos.map(g => g.mes)])].sort();
        
        if (meses.length === 0) {
            canvas.parentElement.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 40px;">Sem dados para exibir</p>';
            return;
        }
        
        const maxValor = Math.max(
            ...evolucao.receitas.map(r => r.valor || 0),
            ...evolucao.gastos.map(g => g.valor || 0),
            1
        );
        
        const padding = 50;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        const barWidth = Math.max(15, Math.min(40, chartWidth / (meses.length * 2.5)));
        const spacing = barWidth * 0.3;
        
        // Fundo
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.fillRect(padding, padding, chartWidth, chartHeight);
        
        // Linhas de grade
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding + (chartHeight / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
            
            // Labels do eixo Y
            const valor = maxValor * (1 - i / 4);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.font = '10px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(formatarMoedaSimples(valor), padding - 10, y + 4);
        }
        
        // Desenhar barras
        meses.forEach((mes, i) => {
            const receita = evolucao.receitas.find(r => r.mes === mes)?.valor || 0;
            const gasto = evolucao.gastos.find(g => g.mes === mes)?.valor || 0;
            
            const x = padding + (chartWidth / meses.length) * i + spacing;
            const receitaHeight = Math.max(0, (receita / maxValor) * chartHeight);
            const gastoHeight = Math.max(0, (gasto / maxValor) * chartHeight);
            
            // Barra receita (verde)
            if (receitaHeight > 0) {
                ctx.fillStyle = '#38ef7d';
                ctx.fillRect(x, height - padding - receitaHeight, barWidth, receitaHeight);
            }
            
            // Barra gasto (vermelho)
            if (gastoHeight > 0) {
                ctx.fillStyle = '#f45c43';
                ctx.fillRect(x + barWidth + 5, height - padding - gastoHeight, barWidth, gastoHeight);
            }
            
            // Label do mês
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.font = '11px Arial';
            ctx.textAlign = 'center';
            const mesNome = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][parseInt(mes.split('-')[1]) - 1] || mes;
            ctx.fillText(mesNome, x + barWidth, height - padding + 20);
        });
        
        // Legenda
        const legendY = 15;
        ctx.fillStyle = '#38ef7d';
        ctx.fillRect(width - 150, legendY, 15, 15);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Receitas', width - 130, legendY + 12);
        
        ctx.fillStyle = '#f45c43';
        ctx.fillRect(width - 150, legendY + 20, 15, 15);
        ctx.fillText('Gastos', width - 130, legendY + 32);
        
    } catch (error) {
        console.error('Erro ao carregar gráfico:', error);
        const canvas = document.getElementById('chart-evolucao');
        if (canvas && canvas.parentElement) {
            canvas.parentElement.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 40px;">Erro ao carregar gráfico</p>';
        }
    }
}

function formatarMoedaSimples(valor) {
    try {
        if (isNaN(valor)) return 'R$ 0';
        if (valor >= 1000) {
            return 'R$ ' + (valor / 1000).toFixed(1) + 'k';
        }
        return 'R$ ' + valor.toFixed(0);
    } catch (error) {
        return 'R$ 0';
    }
}

// ALERTAS
async function carregarAlertas() {
    const alertas = await fetch('/api/alertas').then(r => r.json());
    
    const container = document.getElementById('alertas-container');
    if (!container) return;
    
    if (alertas.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 20px;">Nenhum alerta</p>';
        return;
    }
    
    container.innerHTML = alertas.map(alerta => `
        <div class="alerta-item ${alerta.tipo}" onclick="marcarAlertaLido(${alerta.id})">
            ${alerta.mensagem}
        </div>
    `).join('');
}

async function marcarAlertaLido(id) {
    await fetch(`/api/alertas/marcar-lido/${id}`, { method: 'POST' });
    carregarAlertas();
}

// Atualizar carregarDados para incluir novas funcionalidades
const carregarDadosOriginal = carregarDados;
carregarDados = async function() {
    await carregarDadosOriginal();
    await carregarComparacao();
    await carregarGraficoEvolucao();
    await carregarAlertas();
    await carregarMetas();
};

// Backup automático a cada 24h
setInterval(async () => {
    const backup = await fetch('/api/backup').then(r => r.json());
    localStorage.setItem('backup_financas', JSON.stringify(backup));
    console.log('✅ Backup automático realizado');
}, 24 * 60 * 60 * 1000);


// ===== GASTOS RECORRENTES =====
window.abrirModalRecorrente = function() {
    console.log('Abrindo modal recorrente');
    const modal = document.getElementById('modal-recorrente');
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
    } else {
        console.error('Modal recorrente não encontrado');
    }
}

window.fecharModalRecorrente = function() {
    const modal = document.getElementById('modal-recorrente');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        const form = document.getElementById('form-recorrente');
        if (form) form.reset();
    }
}

function usarTemplate(desc, valor, cat, dia) {
    document.getElementById('rec-descricao').value = desc;
    document.getElementById('rec-valor').value = valor;
    document.getElementById('rec-categoria').value = cat;
    document.getElementById('rec-dia').value = dia;
    abrirModalRecorrente();
}

document.getElementById('form-recorrente')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const desc = document.getElementById('rec-descricao').value;
    const valorInput = document.getElementById('rec-valor');
    const valorTexto = valorInput.value.replace(/\D/g, '');
    const valor = parseFloat(valorTexto) / 100;
    const cat = document.getElementById('rec-categoria').value;
    const dia = parseInt(document.getElementById('rec-dia').value);
    
    if (!desc || valor <= 0 || !cat || dia < 1 || dia > 28) {
        mostrarErro('Preencha todos os campos corretamente');
        return;
    }
    
    try {
        const response = await fetch('/api/recorrentes', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({descricao: desc, valor, categoria: cat, dia_vencimento: dia})
        });
        
        if (!response.ok) throw new Error('Erro ao criar recorrente');
        
        fecharModalRecorrente();
        carregarRecorrentes();
        mostrarNotificacao('🔄 Gasto recorrente criado!', 'success');
    } catch (error) {
        console.error('Erro:', error);
        mostrarErro('Erro ao criar recorrente');
    }
});

// Aplicar máscara no input de recorrentes
const recValorInput = document.getElementById('rec-valor');
if (recValorInput && !recValorInput.parentElement.classList.contains('input-moeda-wrapper')) {
    const wrapper = document.createElement('div');
    wrapper.className = 'input-moeda-wrapper';
    recValorInput.parentNode.insertBefore(wrapper, recValorInput);
    wrapper.appendChild(recValorInput);
    
    // Criar ícone SVG moderno
    const simbolo = document.createElement('div');
    simbolo.className = 'moeda-simbolo';
    simbolo.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="white" fill-opacity="0.2"/>
            <text x="12" y="17" text-anchor="middle" fill="white" font-size="14" font-weight="700" font-family="Arial">R$</text>
        </svg>
    `;
    wrapper.insertBefore(simbolo, recValorInput);
    
    const display = document.createElement('div');
    display.className = 'moeda-display';
    display.textContent = '0,00';
    wrapper.appendChild(display);
    
    recValorInput.addEventListener('input', function(e) {
        let valor = e.target.value.replace(/\D/g, '');
        
        if (valor.length === 0) {
            e.target.value = '';
            e.target.parentElement.querySelector('.moeda-display').textContent = '0,00';
            e.target.parentElement.classList.remove('has-value');
            return;
        }
        
        valor = (parseInt(valor) / 100).toFixed(2);
        const valorFormatado = valor.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        
        e.target.value = valor.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        e.target.parentElement.querySelector('.moeda-display').textContent = valorFormatado;
        e.target.parentElement.classList.add('has-value');
        
        e.target.parentElement.classList.add('typing');
        setTimeout(() => e.target.parentElement.classList.remove('typing'), 150);
    });
    
    recValorInput.addEventListener('focus', function(e) {
        e.target.parentElement.classList.add('focused');
    });
    
    recValorInput.addEventListener('blur', function(e) {
        e.target.parentElement.classList.remove('focused');
    });
}

async function carregarRecorrentes() {
    try {
        const recs = await fetch('/api/recorrentes').then(r => r.json());
        const container = document.getElementById('recorrentes-container');
        if (!container) return;
        
        if (recs.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--text-light);">Nenhum gasto recorrente cadastrado</p>';
            return;
        }
        
        container.innerHTML = recs.map(r => `
            <div class="recorrente-card ${r.ativo ? 'ativo' : 'inativo'}">
                <div class="recorrente-header">
                    <div class="recorrente-icon">${getCategoriaIcon(r.categoria)}</div>
                    <div class="recorrente-info">
                        <h4>${r.descricao}</h4>
                        <p class="recorrente-categoria">${r.categoria}</p>
                    </div>
                </div>
                <div class="recorrente-detalhes">
                    <div class="recorrente-valor">${formatarMoeda(r.valor)}</div>
                    <div class="recorrente-vencimento">Dia ${r.dia_vencimento}</div>
                </div>
                <div class="recorrente-actions">
                    <button class="btn-icon ${r.ativo ? 'ativo' : 'inativo'}" onclick="toggleRecorrente(${r.id}, ${r.ativo})" title="${r.ativo ? 'Desativar' : 'Ativar'}">
                        ${r.ativo ? '✅' : '⏸️'}
                    </button>
                    <button class="btn-icon danger" onclick="deletarRecorrente(${r.id})" title="Excluir">🗑️</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar recorrentes:', error);
    }
}

function getCategoriaIcon(categoria) {
    const icons = {
        'Alimentação': '🍔',
        'Transporte': '🚗',
        'Moradia': '🏠',
        'Saúde': '💊',
        'Lazer': '🎮',
        'Educação': '📚',
        'Outros': '📦'
    };
    return icons[categoria] || '📦';
}

async function toggleRecorrente(id, ativo) {
    try {
        await fetch('/api/recorrentes', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id, ativo: ativo ? 0 : 1})
        });
        carregarRecorrentes();
        mostrarNotificacao(ativo ? '⏸️ Recorrente desativado' : '✅ Recorrente ativado', 'info');
    } catch (error) {
        mostrarErro('Erro ao atualizar recorrente');
    }
}

async function deletarRecorrente(id) {
    if (!confirm('Excluir este gasto recorrente?')) return;
    
    try {
        await fetch(`/api/recorrentes?id=${id}`, {method: 'DELETE'});
        carregarRecorrentes();
        mostrarNotificacao('🗑️ Recorrente excluído', 'success');
    } catch (error) {
        mostrarErro('Erro ao excluir recorrente');
    }
}

async function gerarRecorrentes() {
    try {
        const response = await fetch('/api/recorrentes/gerar', {method: 'POST'}).then(r => r.json());
        if (response.gerados > 0) {
            mostrarNotificacao(`⚡ ${response.gerados} gasto(s) gerado(s) para este mês!`, 'success');
            await carregarDados();
            await carregarPrevisoes();
        } else {
            mostrarAviso('Todos os gastos recorrentes já foram gerados este mês');
        }
    } catch (error) {
        mostrarErro('Erro ao gerar gastos recorrentes');
    }
}

// ===== PREVISÕES =====
async function carregarPrevisoes() {
    try {
        const prevs = await fetch('/api/previsoes').then(r => r.json());
        const container = document.getElementById('previsoes-container');
        if (!container) return;
        
        container.innerHTML = prevs.map(p => {
            const percentual = p.percentual;
            const status = percentual > 100 ? 'danger' : percentual > 80 ? 'warning' : 'success';

// ===== FILTRO POR MÊS =====
let gastosCacheGlobal = [];
let receitasCacheGlobal = [];

function calcularResumoMensal(gastos) {
    const mesAtual = new Date().toISOString().slice(0, 7);
    const gastosMesAtual = gastos.filter(g => g.data.startsWith(mesAtual));
    
    const gastosFixos = gastosMesAtual.filter(g => g.tags && g.tags.includes('recorrente'));
    const gastosVariaveis = gastosMesAtual.filter(g => !g.tags || !g.tags.includes('recorrente'));
    
    const totalFixos = gastosFixos.reduce((sum, g) => sum + parseFloat(g.valor), 0);
    const totalVariaveis = gastosVariaveis.reduce((sum, g) => sum + parseFloat(g.valor), 0);
    const totalMes = totalFixos + totalVariaveis;
    
    const elemFixos = document.getElementById('resumo-fixos');
    const elemVariaveis = document.getElementById('resumo-variaveis');
    const elemTotal = document.getElementById('resumo-total-mes');
    
    if (elemFixos) elemFixos.textContent = formatarMoeda(totalFixos);
    if (elemVariaveis) elemVariaveis.textContent = formatarMoeda(totalVariaveis);
    if (elemTotal) elemTotal.textContent = formatarMoeda(totalMes);
}

async function filtrarPorMes() {
    const mes = document.getElementById('filtro-mes').value;
    if (!mes) return;
    
    try {
        const [receitas, gastos] = await Promise.all([
            fetch('/api/receitas').then(r => r.json()),
            fetch('/api/gastos/mes?mes=' + mes).then(r => r.json())
        ]);
        
        const receitasFiltradas = receitas.filter(r => r.data.startsWith(mes));
        
        atualizarListaHistorico(receitasFiltradas, gastos);
        mostrarNotificacao(`📅 Mostrando ${mes.split('-')[1]}/${mes.split('-')[0]}`, 'info');
    } catch (error) {
        mostrarErro('Erro ao filtrar por mês');
    }
}

function limparFiltroMes() {
    document.getElementById('filtro-mes').value = '';
    document.getElementById('busca-historico').value = '';
    carregarDados();
}

function atualizarListaHistorico(receitas, gastos) {
    const listaReceitas = document.getElementById('lista-receitas');
    const listaGastos = document.getElementById('lista-gastos');
    
    receitasCacheGlobal = receitas;
    gastosCacheGlobal = gastos;
    
    const gastosFixos = gastos.filter(g => g.tags && g.tags.includes('recorrente'));
    const gastosVariaveis = gastos.filter(g => !g.tags || !g.tags.includes('recorrente'));
    
    document.getElementById('count-receitas').textContent = `${receitas.length} ${receitas.length === 1 ? 'item' : 'itens'}`;
    document.getElementById('count-gastos').textContent = `${gastos.length} ${gastos.length === 1 ? 'item' : 'itens'}`;
    document.getElementById('count-gastos-fixos').textContent = `${gastosFixos.length} fixos`;
    
    listaReceitas.innerHTML = receitas.length === 0 ? '<p style="text-align: center; color: #999; padding: 2rem;">Nenhuma receita encontrada</p>' : 
        receitas.map(r => `
            <div class="item-moderna">
                <div class="item-info-moderna">
                    <div class="item-titulo-moderna">${r.descricao}</div>
                    <div class="item-detalhes-moderna">
                        <span class="badge-categoria-moderna ${r.tipo.toLowerCase()}">${r.tipo}</span>
                        <span>${formatarData(r.data)}</span>
                        ${r.tags ? `<span class="badge-tag-moderna">${r.tags}</span>` : ''}
                    </div>
                    ${r.notas ? `<div class="item-notas-moderna">${r.notas}</div>` : ''}
                </div>
                <div class="item-acoes-moderna">
                    <div class="item-valor-moderna receita">+${formatarMoeda(r.valor)}</div>
                    <button class="btn-icon-moderna edit" onclick="editarReceita(${r.id})" title="Editar">✏️</button>
                    <button class="btn-icon-moderna delete" onclick="confirmarExclusaoReceita(${r.id})" title="Excluir">🗑️</button>
                </div>
            </div>
        `).join('');
    
    listaGastos.innerHTML = gastos.length === 0 ? '<p style="text-align: center; color: #999; padding: 2rem;">Nenhum gasto encontrado</p>' :
        [...gastosFixos.map(g => criarItemGasto(g, true)), ...gastosVariaveis.map(g => criarItemGasto(g, false))].join('');
}

function criarItemGasto(g, ehFixo) {
    return `
        <div class="item-moderna ${ehFixo ? 'item-fixo' : ''}">
            <div class="item-info-moderna">
                <div class="item-titulo-moderna">
                    ${ehFixo ? '🔄 ' : ''}${g.descricao}
                    ${ehFixo ? '<span class="badge-fixo">FIXO</span>' : ''}
                </div>
                <div class="item-detalhes-moderna">
                    <span class="badge-categoria-moderna ${g.categoria.toLowerCase()}">${g.categoria}</span>
                    <span>${formatarData(g.data)}</span>
                    ${g.tags ? `<span class="badge-tag-moderna">${g.tags}</span>` : ''}
                </div>
                ${g.notas ? `<div class="item-notas-moderna">${g.notas}</div>` : ''}
            </div>
            <div class="item-acoes-moderna">
                <div class="item-valor-moderna gasto">-${formatarMoeda(g.valor)}</div>
                <button class="btn-icon-moderna edit" onclick="editarGasto(${g.id})" title="Editar">✏️</button>
                <button class="btn-icon-moderna delete" onclick="confirmarExclusaoGasto(${g.id})" title="Excluir">🗑️</button>
            </div>
        </div>
    `;
}

// ===== PREVISÕES =====
            const icon = percentual > 100 ? '🚨' : percentual > 80 ? '⚠️' : '✅';
            
            return `
                <div class="previsao-card ${status}">
                    <div class="previsao-header">
                        <h3>${p.categoria}</h3>
                        <span class="previsao-icon">${icon}</span>
                    </div>
                    <div class="previsao-valores">
                        <div class="previsao-item">
                            <span class="previsao-label">Previsto</span>
                            <span class="previsao-valor">${formatarMoeda(p.previsto)}</span>
                        </div>
                        <div class="previsao-item">
                            <span class="previsao-label">Real</span>
                            <span class="previsao-valor">${formatarMoeda(p.real)}</span>
                        </div>
                    </div>
                    <div class="previsao-progress">
                        <div class="progress-bar">
                            <div class="progress-fill ${status}" style="width: ${Math.min(percentual, 100)}%"></div>
                        </div>
                        <span class="previsao-percentual">${percentual.toFixed(0)}%</span>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Erro ao carregar previsões:', error);
    }
}

// ===== RELATÓRIO IR =====
async function carregarRelatorioIR() {
    try {
        const ano = document.getElementById('ir-ano')?.value || new Date().getFullYear();
        const ir = await fetch(`/api/relatorio-ir?ano=${ano}`).then(r => r.json());
        
        document.getElementById('ir-receitas').textContent = formatarMoeda(ir.receitas_tributaveis);
        document.getElementById('ir-deducoes').textContent = formatarMoeda(ir.total_deducoes);
        
        const detalhes = document.getElementById('ir-detalhes-container');
        if (detalhes) {
            detalhes.innerHTML = ir.despesas_dedutiveis.map(d => `
                <div class="ir-detalhe-item">
                    <span class="ir-categoria">${d.categoria}</span>
                    <span class="ir-valor">${formatarMoeda(d.total)}</span>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Erro ao carregar relatório IR:', error);
    }
}

function exportarRelatorioIR() {
    const ano = document.getElementById('ir-ano')?.value || new Date().getFullYear();
    const receitas = document.getElementById('ir-receitas')?.textContent || 'R$ 0,00';
    const deducoes = document.getElementById('ir-deducoes')?.textContent || 'R$ 0,00';
    
    const html = `
        <html>
        <head>
            <title>Relatório IR ${ano}</title>
            <style>
                body { font-family: Arial; padding: 40px; }
                h1 { color: #333; }
                .resumo { display: flex; gap: 40px; margin: 30px 0; }
                .card { padding: 20px; border: 2px solid #ddd; border-radius: 8px; }
                .valor { font-size: 24px; font-weight: bold; color: #667eea; }
            </style>
        </head>
        <body>
            <h1>📋 Relatório Imposto de Renda ${ano}</h1>
            <div class="resumo">
                <div class="card">
                    <h3>Receitas Tributáveis</h3>
                    <div class="valor">${receitas}</div>
                </div>
                <div class="card">
                    <h3>Despesas Dedutíveis</h3>
                    <div class="valor">${deducoes}</div>
                </div>
            </div>
        </body>
        </html>
    `;
    
    const win = window.open('', '', 'width=800,height=600');
    win.document.write(html);
    win.document.close();
    win.print();
}

// ===== COMPROVANTES =====
let comprovanteBase64 = null;

function previewComprovante(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        comprovanteBase64 = e.target.result;
        const preview = document.getElementById('preview-comprovante');
        if (preview) {
            preview.innerHTML = `<img src="${comprovanteBase64}" style="max-width: 200px; border-radius: 8px; margin-top: 10px;">`;
        }
    };
    reader.readAsDataURL(file);
}

async function salvarComprovante(tipo, id) {
    if (!comprovanteBase64) return;
    
    try {
        await fetch('/api/comprovantes', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                transacao_tipo: tipo,
                transacao_id: id,
                arquivo_base64: comprovanteBase64
            })
        });
        comprovanteBase64 = null;
    } catch (error) {
        console.error('Erro ao salvar comprovante:', error);
    }
}

// ===== TAGS =====
async function carregarTags() {
    try {
        const tags = await fetch('/api/tags').then(r => r.json());
        const datalist = document.getElementById('tags-list');
        if (datalist) {
            datalist.innerHTML = tags.map(t => `<option value="${t}">`).join('');
        }
    } catch (error) {
        console.error('Erro ao carregar tags:', error);
    }
}

// Atualizar carregamento inicial
document.addEventListener('DOMContentLoaded', () => {
    carregarTags();
    if (document.getElementById('page-recorrentes')) carregarRecorrentes();
    if (document.getElementById('page-previsoes')) carregarPrevisoes();
    if (document.getElementById('page-relatorio-ir')) carregarRelatorioIR();
});
