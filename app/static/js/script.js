// Tratamento de Erros Global
function mostrarErro(mensagem) {
    const container = document.createElement('div');
    container.className = 'error-toast';
    container.innerHTML = `
        <div style="background: #ef4444; color: white; padding: 1rem; border-radius: 8px; 
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin: 1rem; max-width: 400px;">
            <strong>❌ Erro</strong><br>${mensagem}
        </div>
    `;
    container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 10000;';
    document.body.appendChild(container);
    setTimeout(() => container.remove(), 5000);
}

async function fetchComTratamento(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || `Erro ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        if (error.message.includes('Failed to fetch')) {
            mostrarErro('Sem conexão com o servidor. Verifique sua internet.');
        } else {
            mostrarErro(error.message);
        }
        throw error;
    }
}

// Navegação
function navigateTo(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    
    document.getElementById(`page-${page}`).classList.add('active');
    event.target.closest('.menu-item').classList.add('active');
}

function selectTipo(tipo) {
    document.querySelectorAll('.tipo-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.tipo-btn').classList.add('active');
    
    document.querySelectorAll('.form-card').forEach(form => form.classList.remove('active'));
    document.getElementById(`form-${tipo}-container`).classList.add('active');
}

// Loading Spinner
function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Restaurar tema salvo
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    }
    
    carregarDados();
    setDataHoje();
    atualizarDataAtual();
    aplicarMascaraMoeda();
    
    document.getElementById('form-receita').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validações
        const descricao = document.getElementById('receita-desc').value;
        if (!validarCampoTexto(descricao, 'Descrição')) return;
        
        const valorTexto = document.getElementById('receita-valor').value;
        const valor = validarValorMonetario(valorTexto, 'Valor');
        if (valor === null) return;
        
        const tipo = validarRadioSelecionado('receita-tipo', 'o tipo de receita');
        if (!tipo) return;
        
        const data = document.getElementById('receita-data').value;
        if (!validarData(data, 'Data')) return;
        
        const notas = document.getElementById('receita-notas')?.value || '';
        const tags = document.getElementById('receita-tags')?.value || '';
        
        try {
            showLoading();
            const response = await fetch('/api/receitas', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    descricao: descricao.trim(),
                    valor: valor,
                    tipo: tipo,
                    data: data,
                    notas: notas.trim(),
                    tags: tags.trim()
                })
            });
            
            if (!response.ok) {
                throw new Error('Erro ao adicionar receita');
            }
            
            e.target.reset();
            setDataHoje();
            carregarDados();
            mostrarNotificacao('✅ Receita adicionada com sucesso!', 'success');
        } catch (error) {
            console.error('Erro:', error);
            mostrarErro('Erro ao adicionar receita. Tente novamente.');
        } finally {
            hideLoading();
        }
    });
    
    document.getElementById('form-gasto').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validações
        const descricao = document.getElementById('gasto-desc').value;
        if (!validarCampoTexto(descricao, 'Descrição')) return;
        
        const valorTexto = document.getElementById('gasto-valor').value;
        const valor = validarValorMonetario(valorTexto, 'Valor');
        if (valor === null) return;
        
        const categoria = validarRadioSelecionado('gasto-categoria', 'a categoria');
        if (!categoria) return;
        
        const data = document.getElementById('gasto-data').value;
        if (!validarData(data, 'Data')) return;
        
        const notas = document.getElementById('gasto-notas')?.value || '';
        const tags = document.getElementById('gasto-tags')?.value || '';
        
        try {
            const response = await fetch('/api/gastos', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    descricao: descricao.trim(),
                    valor: valor,
                    categoria: categoria,
                    data: data,
                    notas: notas.trim(),
                    tags: tags.trim()
                })
            });
            
            if (!response.ok) {
                throw new Error('Erro ao adicionar gasto');
            }
            
            const result = await response.json();
            if (result.success && comprovanteBase64) {
                await salvarComprovante('gasto', result.id);
            }
            
            e.target.reset();
            setDataHoje();
            carregarDados();
            mostrarNotificacao('✅ Gasto adicionado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro:', error);
            mostrarErro('Erro ao adicionar gasto. Tente novamente.');
        } finally {
            hideLoading();
        }
    });
});

// Máscara de moeda
function aplicarMascaraMoeda() {
    const inputs = ['receita-valor', 'gasto-valor'];
    
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (!input) return;
        
        // Criar wrapper moderno
        if (!input.parentElement.classList.contains('input-moeda-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'input-moeda-wrapper';
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);
            
            // Criar ícone SVG moderno
            const simbolo = document.createElement('div');
            simbolo.className = 'moeda-simbolo';
            simbolo.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="white" fill-opacity="0.2"/>
                    <text x="12" y="17" text-anchor="middle" fill="white" font-size="14" font-weight="700" font-family="Arial">R$</text>
                </svg>
            `;
            wrapper.insertBefore(simbolo, input);
            
            const display = document.createElement('div');
            display.className = 'moeda-display';
            display.textContent = '0,00';
            wrapper.appendChild(display);
        }
        
        input.addEventListener('input', function(e) {
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
            
            // Animação
            e.target.parentElement.classList.add('typing');
            setTimeout(() => e.target.parentElement.classList.remove('typing'), 150);
        });
        
        input.addEventListener('focus', function(e) {
            e.target.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function(e) {
            e.target.parentElement.classList.remove('focused');
        });
    });
}

function atualizarDataAtual() {
    const agora = new Date();
    const opcoes = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = agora.toLocaleDateString('pt-BR', opcoes);
}

function setDataHoje() {
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('receita-data').value = hoje;
    document.getElementById('gasto-data').value = hoje;
}

async function carregarDados() {
    try {
        showLoading();
        const [receitas, gastos, resumo] = await Promise.all([
            fetch('/api/receitas').then(r => r.json()),
            fetch('/api/gastos').then(r => r.json()),
            fetch('/api/resumo').then(r => r.json())
        ]);
        
        if (!receitas || !gastos || !resumo) {
            throw new Error('Dados inválidos recebidos');
        }
    
    // Dashboard
    document.getElementById('dash-receitas').textContent = formatarMoeda(resumo.receitas);
    document.getElementById('dash-gastos').textContent = formatarMoeda(resumo.gastos);
    document.getElementById('dash-saldo').textContent = formatarMoeda(resumo.saldo);
    
    const percentualGasto = resumo.receitas > 0 ? (resumo.gastos / resumo.receitas * 100).toFixed(0) : 0;
    document.getElementById('badge-gastos').textContent = `${percentualGasto}% da renda`;
    
    if (resumo.saldo > 0) {
        document.getElementById('badge-saldo').textContent = '✅ Positivo';
    } else {
        document.getElementById('badge-saldo').textContent = '⚠️ Negativo';
    }
    
    // Calcular gastos por categoria
    const gastosPorCategoria = gastos.reduce((acc, g) => {
        acc[g.categoria] = (acc[g.categoria] || 0) + g.valor;
        return acc;
    }, {});
    
    // Saúde Financeira
    calcularSaudeFinanceira(resumo, gastosPorCategoria);
    
    // Dicas Rápidas
    gerarDicasRapidas(resumo, gastosPorCategoria);
    
    // Chart de Gastos
    gerarChartGastos(gastosPorCategoria, resumo.gastos);
    
    // Chart de Evolução
    gerarChartEvolucao(receitas, gastos);
    
    // Métricas (página Insights)
    calcularMetricas(receitas, gastos, resumo);
    gerarInsights(receitas, gastos, resumo, gastosPorCategoria);
    
    // Histórico
    if (typeof atualizarListaHistorico === 'function') {
        atualizarListaHistorico(receitas, gastos);
    } else {
        document.getElementById('count-receitas').textContent = `${receitas.length} ${receitas.length === 1 ? 'item' : 'itens'}`;
        document.getElementById('count-gastos').textContent = `${gastos.length} ${gastos.length === 1 ? 'item' : 'itens'}`;
        
        const gastosFixos = gastos.filter(g => g.tags && g.tags.includes('recorrente'));
        const countGastosFixos = document.getElementById('count-gastos-fixos');
        if (countGastosFixos) {
            countGastosFixos.textContent = `${gastosFixos.length} fixos`;
        }
    }
    
    // Resumo Mensal
    if (typeof calcularResumoMensal === 'function') {
        calcularResumoMensal(gastos);
    }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        mostrarErro('Erro ao carregar dados. Recarregue a página.');
    } finally {
        hideLoading();
    }
}

function calcularSaudeFinanceira(resumo, gastosPorCategoria) {
    try {
        let score = 100;
        
        // Validar dados
        const receitas = parseFloat(resumo.receitas) || 0;
        const gastos = parseFloat(resumo.gastos) || 0;
        const saldo = parseFloat(resumo.saldo) || 0;
        
        // Penalizar se gastar mais que ganha
        if (saldo < 0) score -= 40;
        
        // Penalizar se renda muito comprometida
        const percentualComprometido = receitas > 0 ? (gastos / receitas * 100) : 0;
        if (percentualComprometido > 90) score -= 30;
        else if (percentualComprometido > 70) score -= 20;
        else if (percentualComprometido > 50) score -= 10;
        
        // Penalizar gastos fixos altos
        const fixos = parseFloat(gastosPorCategoria['Fixo']) || 0;
        if (receitas > 0 && fixos > receitas * 0.5) score -= 15;
        
        // Bonificar economia
        const percentualEconomia = receitas > 0 ? (saldo / receitas * 100) : 0;
        if (percentualEconomia >= 30) score += 10;
        else if (percentualEconomia >= 20) score += 5;
        
        // Garantir que score está entre 0 e 100
        score = Math.max(0, Math.min(100, Math.round(score)));
        
        const scoreElement = document.getElementById('score-value');
        if (scoreElement) {
            scoreElement.textContent = score;
        }
        
        const circle = document.getElementById('score-circle');
        if (circle) {
            const circumference = 283;
            const offset = circumference - (score / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        }
        
        let label = '';
        if (score >= 80) label = '🎉 Excelente! Saúde financeira ótima';
        else if (score >= 60) label = '👍 Bom! Continue assim';
        else if (score >= 40) label = '⚠️ Atenção! Precisa melhorar';
        else label = '🚨 Crítico! Revise urgente';
        
        const labelElement = document.getElementById('score-label');
        if (labelElement) {
            labelElement.textContent = label;
        }
    } catch (error) {
        console.error('Erro ao calcular saúde financeira:', error);
    }
}

function gerarDicasRapidas(resumo, gastosPorCategoria) {
    const dicas = [];
    
    if (resumo.saldo > 0) {
        const percentualEconomia = (resumo.saldo / resumo.receitas * 100).toFixed(0);
        dicas.push({
            icon: '💰',
            titulo: 'Economize Mais',
            texto: `Você está economizando ${percentualEconomia}% da renda. Tente chegar a 20%!`
        });
    }
    
    const fixos = gastosPorCategoria['Fixo'] || 0;
    if (fixos > 0) {
        dicas.push({
            icon: '🏠',
            titulo: 'Gastos Fixos',
            texto: `Seus gastos fixos são ${formatarMoeda(fixos)}. Renegocie contratos para reduzir.`
        });
    }
    
    const cartao = gastosPorCategoria['Cartão'] || 0;
    if (cartao > resumo.receitas * 0.2) {
        dicas.push({
            icon: '💳',
            titulo: 'Cuidado com Cartão',
            texto: 'Gastos no cartão estão altos. Evite parcelamentos desnecessários.'
        });
    }
    
    dicas.push({
        icon: '🎯',
        titulo: 'Meta de Economia',
        texto: 'Especialistas recomendam economizar 20% da renda mensal.'
    });
    
    const container = document.getElementById('dicas-container');
    container.innerHTML = dicas.map(dica => `
        <div class="dica-item">
            <div class="dica-titulo">
                <span>${dica.icon}</span>
                <span>${dica.titulo}</span>
            </div>
            <div class="dica-texto">${dica.texto}</div>
        </div>
    `).join('');
}

function gerarChartGastos(gastosPorCategoria, totalGastos) {
    try {
        const container = document.getElementById('chart-gastos');
        const canvasPizza = document.getElementById('chart-pizza');
        
        console.log('🔍 Debug Chart Pizza:', {
            container: !!container,
            canvasPizza: !!canvasPizza,
            totalGastos,
            gastosPorCategoria,
            chartJsDisponivel: typeof Chart !== 'undefined'
        });
        
        if (!container) return;
        
        // Se não houver gastos
        if (totalGastos === 0 || !totalGastos) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 40px;">Sem gastos cadastrados</p>';
            if (canvasPizza) {
                const ctx = canvasPizza.getContext('2d');
                ctx.clearRect(0, 0, canvasPizza.width, canvasPizza.height);
            }
            return;
        }
        
        // Ordenar categorias por valor
        const categorias = Object.entries(gastosPorCategoria)
            .map(([nome, valor]) => ({ nome, valor }))
            .sort((a, b) => b.valor - a.valor);
        
        // Gráfico de barras (existente)
        container.innerHTML = categorias.map(cat => {
            const percentual = totalGastos > 0 ? Math.round((cat.valor / totalGastos * 100)) : 0;
            const valorFormatado = formatarMoeda(cat.valor);
            const icone = getCategoriaIcon(cat.nome);
            
            return `
                <div class="chart-bar-item">
                    <div class="chart-label">${icone} ${cat.nome}</div>
                    <div class="chart-bar-bg">
                        <div class="chart-bar-fill" style="width: ${percentual}%">
                            ${percentual > 15 ? valorFormatado : ''}
                        </div>
                    </div>
                    <div class="chart-valor">${percentual}%</div>
                </div>
            `;
        }).join('');
        
        // Gráfico de Pizza com Chart.js
        if (canvasPizza && typeof Chart !== 'undefined') {
            const ctx = canvasPizza.getContext('2d');
            
            // Destruir gráfico anterior se existir
            if (window.chartPizzaInstance) {
                window.chartPizzaInstance.destroy();
            }
            
            const cores = [
                '#667eea', '#764ba2', '#f093fb', '#f5576c',
                '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
                '#fa709a', '#fee140', '#30cfd0', '#330867'
            ];
            
            window.chartPizzaInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: categorias.map(c => c.nome),
                    datasets: [{
                        data: categorias.map(c => c.valor),
                        backgroundColor: cores.slice(0, categorias.length),
                        borderWidth: 2,
                        borderColor: '#0f0c29'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#e0e0e0',
                                padding: 15,
                                font: { size: 12 }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const valor = formatarMoeda(context.parsed);
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentual = ((context.parsed / total) * 100).toFixed(1);
                                    return `${context.label}: ${valor} (${percentual}%)`;
                                }
                            }
                        }
                    }
                }
            });
            
            console.log('✅ Gráfico de pizza criado com sucesso!');
        } else {
            console.warn('⚠️ Canvas ou Chart.js não disponível');
        }
    } catch (error) {
        console.error('❌ Erro ao gerar chart de gastos:', error);
        const container = document.getElementById('chart-gastos');
        if (container) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 20px;">Erro ao carregar</p>';
        }
    }
}

function calcularMetricas(receitas, gastos, resumo) {
    try {
        // Validar dados
        const totalReceitas = parseFloat(resumo.receitas) || 0;
        const totalGastos = parseFloat(resumo.gastos) || 0;
        const saldo = parseFloat(resumo.saldo) || 0;
        
        // Percentual de renda comprometida
        const percentualComprometido = totalReceitas > 0 ? Math.min(100, (totalGastos / totalReceitas * 100)) : 0;
        const percentualElement = document.getElementById('percentual-comprometido');
        if (percentualElement) {
            percentualElement.textContent = percentualComprometido.toFixed(1) + '%';
        }
        
        const barraElement = document.getElementById('barra-comprometimento');
        if (barraElement) {
            barraElement.style.width = Math.min(percentualComprometido, 100) + '%';
        }
        
        let descComprometimento = '';
        if (percentualComprometido <= 50) descComprometimento = '✅ Excelente! Você está gastando pouco da sua renda';
        else if (percentualComprometido <= 70) descComprometimento = '⚠️ Atenção! Mais de 50% da renda comprometida';
        else if (percentualComprometido <= 90) descComprometimento = '🚨 Cuidado! Renda muito comprometida';
        else descComprometimento = '❌ Alerta! Gastando mais do que ganha';
        
        const descCompElement = document.getElementById('desc-comprometimento');
        if (descCompElement) {
            descCompElement.textContent = descComprometimento;
        }
        
        // Capacidade de economia
        const percentualEconomia = totalReceitas > 0 ? (saldo / totalReceitas * 100) : 0;
        const economiaElement = document.getElementById('percentual-economia');
        if (economiaElement) {
            economiaElement.textContent = Math.max(0, percentualEconomia).toFixed(1) + '%';
        }
        
        const barraEconomiaElement = document.getElementById('barra-economia');
        if (barraEconomiaElement) {
            barraEconomiaElement.style.width = Math.max(0, Math.min(percentualEconomia, 100)) + '%';
        }
        
        let descEconomia = '';
        if (percentualEconomia >= 30) descEconomia = '🎉 Parabéns! Ótima capacidade de poupança';
        else if (percentualEconomia >= 20) descEconomia = '👍 Bom! Conseguindo economizar';
        else if (percentualEconomia >= 10) descEconomia = '💪 Pode melhorar! Tente economizar mais';
        else if (percentualEconomia > 0) descEconomia = '⚠️ Economia baixa! Revise seus gastos';
        else descEconomia = '🚨 Sem capacidade de economia no momento';
        
        const descEconomiaElement = document.getElementById('desc-economia');
        if (descEconomiaElement) {
            descEconomiaElement.textContent = descEconomia;
        }
        
        // Gasto médio diário (últimos 30 dias)
        const hoje = new Date();
        const trintaDiasAtras = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);
        const gastosRecentes = gastos.filter(g => {
            try {
                return new Date(g.data) >= trintaDiasAtras;
            } catch {
                return false;
            }
        });
        
        const totalGastosRecentes = gastosRecentes.reduce((sum, g) => sum + (parseFloat(g.valor) || 0), 0);
        const gastoMedioDia = totalGastosRecentes / 30;
        
        const mediaDiaElement = document.getElementById('gasto-medio-dia');
        if (mediaDiaElement) {
            mediaDiaElement.textContent = formatarMoeda(gastoMedioDia);
        }
        
        // Projeção mensal
        const projecaoMensal = gastoMedioDia * 30;
        const projecaoElement = document.getElementById('projecao-mensal');
        if (projecaoElement) {
            projecaoElement.textContent = formatarMoeda(projecaoMensal);
        }
        
        const diferencaProjecao = totalReceitas - projecaoMensal;
        let descProjecao = '';
        if (diferencaProjecao > 0) {
            descProjecao = `✅ Sobrará ${formatarMoeda(diferencaProjecao)} no mês`;
        } else {
            descProjecao = `⚠️ Faltará ${formatarMoeda(Math.abs(diferencaProjecao))} no mês`;
        }
        
        const descProjecaoElement = document.getElementById('desc-projecao');
        if (descProjecaoElement) {
            descProjecaoElement.textContent = descProjecao;
        }
    } catch (error) {
        console.error('Erro ao calcular métricas:', error);
    }
}

function gerarInsights(receitas, gastos, resumo, gastosPorCategoria) {
    const insights = [];
    
    const maiorCategoria = Object.entries(gastosPorCategoria).sort((a, b) => b[1] - a[1])[0];
    if (maiorCategoria) {
        const percentual = (maiorCategoria[1] / resumo.gastos * 100).toFixed(0);
        insights.push({
            icon: getCategoriaIcon(maiorCategoria[0]),
            title: 'Maior Gasto',
            text: `${maiorCategoria[0]} representa ${percentual}% dos seus gastos (${formatarMoeda(maiorCategoria[1])})`,
            type: 'info'
        });
    }
    
    const mesAtual = new Date().getMonth();
    const gastosEsteMes = gastos.filter(g => new Date(g.data).getMonth() === mesAtual);
    const totalEsteMes = gastosEsteMes.reduce((sum, g) => sum + g.valor, 0);
    
    if (totalEsteMes > 0) {
        insights.push({
            icon: '📊',
            title: 'Gastos do Mês',
            text: `Você já gastou ${formatarMoeda(totalEsteMes)} este mês`,
            type: 'info'
        });
    }
    
    const fixos = gastosPorCategoria['Fixo'] || 0;
    if (fixos > resumo.receitas * 0.5) {
        insights.push({
            icon: '🏠',
            title: 'Gastos Fixos Altos',
            text: `Seus gastos fixos (${formatarMoeda(fixos)}) representam mais de 50% da renda. Considere renegociar contratos.`,
            type: 'warning'
        });
    }
    
    if (resumo.saldo > 0) {
        insights.push({
            icon: '💎',
            title: 'Saldo Positivo',
            text: `Você tem ${formatarMoeda(resumo.saldo)} disponível. Considere investir ou criar uma reserva de emergência!`,
            type: 'success'
        });
    } else if (resumo.saldo < 0) {
        insights.push({
            icon: '⚠️',
            title: 'Saldo Negativo',
            text: `Você está gastando ${formatarMoeda(Math.abs(resumo.saldo))} a mais do que ganha. Revise seus gastos urgentemente!`,
            type: 'danger'
        });
    }
    
    const cartao = gastosPorCategoria['Cartão'] || 0;
    if (cartao > resumo.receitas * 0.3) {
        insights.push({
            icon: '💳',
            title: 'Gastos no Cartão',
            text: `Gastos no cartão (${formatarMoeda(cartao)}) estão altos. Cuidado com juros e parcelamentos!`,
            type: 'warning'
        });
    }
    
    const metaEconomia = resumo.receitas * 0.2;
    if (resumo.saldo >= metaEconomia) {
        insights.push({
            icon: '🎯',
            title: 'Meta Atingida!',
            text: `Parabéns! Você atingiu a meta de economizar 20% da renda (${formatarMoeda(metaEconomia)})`,
            type: 'success'
        });
    } else if (resumo.saldo > 0) {
        const falta = metaEconomia - resumo.saldo;
        insights.push({
            icon: '🎯',
            title: 'Quase lá!',
            text: `Faltam ${formatarMoeda(falta)} para atingir a meta de 20% de economia`,
            type: 'info'
        });
    }
    
    const container = document.getElementById('insights-container');
    container.innerHTML = insights.map(insight => `
        <div class="insight-item ${insight.type}">
            <div class="insight-icon">${insight.icon}</div>
            <div class="insight-content">
                <div class="insight-title">${insight.title}</div>
                <div class="insight-text">${insight.text}</div>
            </div>
        </div>
    `).join('');
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

function exportarDados() {
    fetch('/api/receitas').then(r => r.json()).then(receitas => {
        fetch('/api/gastos').then(r => r.json()).then(gastos => {
            const dados = { receitas, gastos };
            const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `financas-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            mostrarNotificacao('📥 Dados exportados em JSON!', 'success');
        });
    });
}

async function exportarPDF() {
    const [receitas, gastos, resumo] = await Promise.all([
        fetch('/api/receitas').then(r => r.json()),
        fetch('/api/gastos').then(r => r.json()),
        fetch('/api/resumo').then(r => r.json())
    ]);
    
    // Criar conteúdo HTML para PDF
    const conteudo = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; }
                h1 { color: #667eea; text-align: center; margin-bottom: 30px; }
                .resumo { display: flex; justify-content: space-around; margin-bottom: 40px; }
                .card { text-align: center; padding: 20px; background: #f5f5f5; border-radius: 10px; }
                .card h3 { margin-bottom: 10px; color: #666; }
                .card .valor { font-size: 24px; font-weight: bold; }
                .receitas .valor { color: #11998e; }
                .gastos .valor { color: #eb3349; }
                .saldo .valor { color: #4facfe; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                th { background: #667eea; color: white; padding: 12px; text-align: left; }
                td { padding: 10px; border-bottom: 1px solid #ddd; }
                tr:hover { background: #f9f9f9; }
                .footer { text-align: center; margin-top: 40px; color: #999; font-size: 12px; }
            </style>
        </head>
        <body>
            <h1>💰 Relatório Financeiro</h1>
            <p style="text-align: center; color: #666; margin-bottom: 30px;">
                Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
            </p>
            
            <div class="resumo">
                <div class="card receitas">
                    <h3>Receitas Totais</h3>
                    <div class="valor">${formatarMoeda(resumo.receitas)}</div>
                </div>
                <div class="card gastos">
                    <h3>Gastos Totais</h3>
                    <div class="valor">${formatarMoeda(resumo.gastos)}</div>
                </div>
                <div class="card saldo">
                    <h3>Saldo</h3>
                    <div class="valor">${formatarMoeda(resumo.saldo)}</div>
                </div>
            </div>
            
            <h2 style="color: #11998e; margin-top: 40px;">💵 Receitas</h2>
            <table>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Descrição</th>
                        <th>Tipo</th>
                        <th>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    ${receitas.map(r => `
                        <tr>
                            <td>${formatarData(r.data)}</td>
                            <td>${r.descricao}</td>
                            <td>${r.tipo}</td>
                            <td style="color: #11998e; font-weight: bold;">${formatarMoeda(r.valor)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <h2 style="color: #eb3349; margin-top: 40px;">💸 Gastos</h2>
            <table>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Descrição</th>
                        <th>Categoria</th>
                        <th>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    ${gastos.map(g => `
                        <tr>
                            <td>${formatarData(g.data)}</td>
                            <td>${g.descricao}</td>
                            <td>${g.categoria}</td>
                            <td style="color: #eb3349; font-weight: bold;">${formatarMoeda(g.valor)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="footer">
                <p>Controle Financeiro - Relatório gerado automaticamente</p>
            </div>
        </body>
        </html>
    `;
    
    // Abrir em nova janela para imprimir como PDF
    const janela = window.open('', '_blank');
    janela.document.write(conteudo);
    janela.document.close();
    
    // Aguardar carregamento e abrir diálogo de impressão
    setTimeout(() => {
        janela.print();
        mostrarNotificacao('📄 PDF pronto! Use Ctrl+P ou Salvar como PDF', 'success');
    }, 500);
}

function logout() {
    if (confirm('Deseja realmente sair?')) {
        window.location.href = '/logout';
    }
}

function mostrarNotificacao(mensagem, tipo) {
    const notif = document.createElement('div');
    notif.textContent = mensagem;
    notif.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        padding: 20px 30px;
        background: ${tipo === 'success' ? 'linear-gradient(135deg, #11998e, #38ef7d)' : tipo === 'error' ? 'linear-gradient(135deg, #eb3349, #f45c43)' : 'linear-gradient(135deg, #f39c12, #f1c40f)'};
        color: white;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.5s ease;
    `;
    document.body.appendChild(notif);
    setTimeout(() => {
        notif.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notif.remove(), 500);
    }, 3000);
}

function mostrarErro(mensagem) {
    mostrarNotificacao('❌ ' + mensagem, 'error');
}

function mostrarAviso(mensagem) {
    mostrarNotificacao('⚠️ ' + mensagem, 'warning');
}

function validarCampoTexto(valor, nomeCampo, minLength = 3, maxLength = 200) {
    if (!valor || valor.trim() === '') {
        mostrarErro(`${nomeCampo} é obrigatório`);
        return false;
    }
    if (valor.trim().length < minLength) {
        mostrarErro(`${nomeCampo} deve ter no mínimo ${minLength} caracteres`);
        return false;
    }
    if (valor.length > maxLength) {
        mostrarErro(`${nomeCampo} deve ter no máximo ${maxLength} caracteres`);
        return false;
    }
    return true;
}

function validarValorMonetario(valorTexto, nomeCampo) {
    if (!valorTexto || valorTexto.trim() === '' || valorTexto === 'R$ ') {
        mostrarErro(`${nomeCampo} é obrigatório`);
        return null;
    }
    
    const valor = parseFloat(valorTexto.replace(/[^\d,]/g, '').replace(',', '.'));
    
    if (isNaN(valor) || valor <= 0) {
        mostrarErro(`${nomeCampo} deve ser maior que zero`);
        return null;
    }
    
    if (valor > 999999999) {
        mostrarErro(`${nomeCampo} é muito alto`);
        return null;
    }
    
    return valor;
}

function validarData(data, nomeCampo) {
    if (!data) {
        mostrarErro(`${nomeCampo} é obrigatória`);
        return false;
    }
    
    const dataObj = new Date(data);
    if (isNaN(dataObj.getTime())) {
        mostrarErro(`${nomeCampo} inválida`);
        return false;
    }
    
    return true;
}

function validarRadioSelecionado(name, nomeCampo) {
    const selecionado = document.querySelector(`input[name="${name}"]:checked`);
    if (!selecionado) {
        mostrarErro(`Selecione ${nomeCampo}`);
        return null;
    }
    return selecionado.value;
}

function getTipoIcon(tipo) {
    const icons = { 'Salário': '💼', 'Cartão Benefício': '🎫', 'Outras Rendas': '💰' };
    return icons[tipo] || '💵';
}

function getCategoriaIcon(categoria) {
    const icons = { 'Fixo': '🏠', 'Cartão': '💳', 'Diário': '🛒' };
    return icons[categoria] || '💸';
}

function gerarChartEvolucao(receitas, gastos) {
    try {
        const canvas = document.getElementById('chart-evolucao');
        if (!canvas || typeof Chart === 'undefined') return;
        
        // Agrupar por mês (últimos 6 meses)
        const meses = {};
        const hoje = new Date();
        
        for (let i = 5; i >= 0; i--) {
            const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
            const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
            meses[chave] = { receitas: 0, gastos: 0, label: data.toLocaleDateString('pt-BR', { month: 'short' }) };
        }
        
        // Somar receitas e gastos por mês
        receitas.forEach(r => {
            const mes = r.data.substring(0, 7);
            if (meses[mes]) meses[mes].receitas += parseFloat(r.valor);
        });
        
        gastos.forEach(g => {
            const mes = g.data.substring(0, 7);
            if (meses[mes]) meses[mes].gastos += parseFloat(g.valor);
        });
        
        const labels = Object.values(meses).map(m => m.label);
        const dataReceitas = Object.values(meses).map(m => m.receitas);
        const dataGastos = Object.values(meses).map(m => m.gastos);
        
        // Destruir gráfico anterior
        if (window.chartEvolucaoInstance) {
            window.chartEvolucaoInstance.destroy();
        }
        
        const ctx = canvas.getContext('2d');
        window.chartEvolucaoInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Receitas',
                        data: dataReceitas,
                        borderColor: '#4ade80',
                        backgroundColor: 'rgba(74, 222, 128, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Gastos',
                        data: dataGastos,
                        borderColor: '#f87171',
                        backgroundColor: 'rgba(248, 113, 113, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#e0e0e0',
                            padding: 15,
                            font: { size: 13 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${formatarMoeda(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#e0e0e0',
                            callback: function(value) {
                                return 'R$ ' + value.toLocaleString('pt-BR');
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#e0e0e0'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Erro ao gerar chart de evolução:', error);
    }
}

function formatarMoeda(valor) {
    // Se valor for undefined, null ou NaN, retorna R$ 0,00
    if (valor === undefined || valor === null || isNaN(valor)) {
        valor = 0;
    }
    return new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(valor);
}

function formatarData(data) {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
}

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
}


// ===== FUNÇÕES DE MODAL =====
window.abrirModalMeta = function() {
    const modal = document.getElementById('modal-meta');
    if (modal) {
        modal.classList.add('active');
        const hoje = new Date().toISOString().split('T')[0];
        const dataInicio = document.getElementById('meta-data-inicio');
        if (dataInicio) dataInicio.value = hoje;
    }
}

window.fecharModalMeta = function() {
    const modal = document.getElementById('modal-meta');
    if (modal) {
        modal.classList.remove('active');
        const form = document.getElementById('form-meta');
        if (form) form.reset();
    }
}

// ===== COMPARAÇÃO ANO A ANO =====
async function carregarComparacaoAnos() {
    try {
        const response = await fetch('/api/comparacao/anos');
        const data = await response.json();
        
        if (data.success) {
            renderizarComparacaoAnos(data.dados);
        }
    } catch (error) {
        console.error('Erro ao carregar comparação:', error);
        document.getElementById('comparacao-anos-container').innerHTML = 
            '<div class="comparacao-loading">Erro ao carregar dados</div>';
    }
}

function renderizarComparacaoAnos(dados) {
    const { ano_atual, ano_anterior, receitas, gastos, saldo } = dados;
    
    const html = `
        <div class="comparacao-grid">
            <div class="comparacao-item">
                <h4>💵 Receitas</h4>
                <div class="comparacao-valores">
                    <div class="comparacao-linha">
                        <span class="comparacao-ano">${ano_anterior}</span>
                        <span class="comparacao-valor">${formatarMoeda(receitas.anterior)}</span>
                    </div>
                    <div class="comparacao-linha">
                        <span class="comparacao-ano">${ano_atual}</span>
                        <span class="comparacao-valor">${formatarMoeda(receitas.atual)}</span>
                    </div>
                </div>
                <div class="comparacao-variacao ${receitas.variacao >= 0 ? 'positiva' : 'negativa'}">
                    ${receitas.variacao >= 0 ? '↑' : '↓'} ${Math.abs(receitas.variacao).toFixed(1)}%
                </div>
            </div>
            
            <div class="comparacao-item">
                <h4>💸 Gastos</h4>
                <div class="comparacao-valores">
                    <div class="comparacao-linha">
                        <span class="comparacao-ano">${ano_anterior}</span>
                        <span class="comparacao-valor">${formatarMoeda(gastos.anterior)}</span>
                    </div>
                    <div class="comparacao-linha">
                        <span class="comparacao-ano">${ano_atual}</span>
                        <span class="comparacao-valor">${formatarMoeda(gastos.atual)}</span>
                    </div>
                </div>
                <div class="comparacao-variacao ${gastos.variacao <= 0 ? 'positiva' : 'negativa'}">
                    ${gastos.variacao >= 0 ? '↑' : '↓'} ${Math.abs(gastos.variacao).toFixed(1)}%
                </div>
            </div>
            
            <div class="comparacao-item">
                <h4>💎 Saldo</h4>
                <div class="comparacao-valores">
                    <div class="comparacao-linha">
                        <span class="comparacao-ano">${ano_anterior}</span>
                        <span class="comparacao-valor">${formatarMoeda(saldo.anterior)}</span>
                    </div>
                    <div class="comparacao-linha">
                        <span class="comparacao-ano">${ano_atual}</span>
                        <span class="comparacao-valor">${formatarMoeda(saldo.atual)}</span>
                    </div>
                </div>
                <div class="comparacao-variacao ${saldo.variacao >= 0 ? 'positiva' : 'negativa'}">
                    ${saldo.variacao >= 0 ? '↑' : '↓'} ${Math.abs(saldo.variacao).toFixed(1)}%
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('comparacao-anos-container').innerHTML = html;
}

// Carregar comparação ao carregar dashboard
if (document.getElementById('comparacao-anos-container')) {
    carregarComparacaoAnos();
}
