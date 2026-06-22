/* =============================================
   INICIALIZAÇÃO
   ============================================= */
const token = localStorage.getItem('token');

// Exibe nome do motorista no topbar
const nomeSalvo = localStorage.getItem('nomeMotorista');
if (nomeSalvo) {
    document.getElementById('nomeMotorista').textContent = nomeSalvo;
    document.getElementById('avatarInicial').textContent = nomeSalvo.charAt(0).toUpperCase();
}

// Carrega as viagens ao abrir a página
mostrarViagens();

/* =============================================
   REFERÊNCIAS DOM
   ============================================= */
const grid = document.getElementById('gridViagens');
const modalEdit = document.getElementById('modalEdit');
const erroPlaca = document.getElementById('erroPlaca');

/* =============================================
   BOTÃO SAIR
   ============================================= */
document.getElementById('btnLogout').addEventListener('click', async () => {
    try {
        await fetch('/usuario/logout', { method: 'POST' });
    } catch (e) { }
    localStorage.clear();
    window.location.href = '/';
});

/* =============================================
   PESQUISA LOCAL
   ============================================= */
document.getElementById('btnPesquisar').addEventListener('click', filtrarViagens);
document.getElementById('campoPesquisa').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') filtrarViagens();
});

function filtrarViagens() {
    const termo = document.getElementById('campoPesquisa').value.toLowerCase().trim();
    const cards = grid.querySelectorAll('.vehicle-card');
    cards.forEach(card => {
        card.style.display = card.innerText.toLowerCase().includes(termo) ? '' : 'none';
    });
}

/* =============================================
   MODAIS — ABRIR / FECHAR
   ============================================= */
document.getElementById('abrirModalEdit').addEventListener('click', () => {
    modalEdit.style.display = 'block';
    document.getElementById('resumoStatus').style.display = 'none';
    document.getElementById('acoesBotoes').style.display = 'none';
    document.getElementById('btnBuscarStatus').style.display = 'inline-block';
    document.getElementById('inputIdStatus').value = '';
});
document.getElementById('fecharModalEdit').addEventListener('click', () => {
    modalEdit.style.display = 'none';
});
document.getElementById('fecharErroPlaca').addEventListener('click', () => {
    erroPlaca.style.display = 'none';
});
document.getElementById('fecharErroPlacaBtn').addEventListener('click', () => {
    erroPlaca.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modalEdit) modalEdit.style.display = 'none';
    if (e.target === erroPlaca) erroPlaca.style.display = 'none';
});

/* =============================================
   FEEDBACK POPUP
   ============================================= */
function exibirFeedback(sucesso, mensagem) {
    const bgPop = document.getElementById('bgPop');
    const msgTitulo = document.getElementById('msgTitulo');
    const msgErro = document.getElementById('msgErro');

    msgErro.innerHTML = mensagem;
    bgPop.classList.remove('bg-success', 'bg-danger');

    if (sucesso) {
        bgPop.classList.add('bg-success');
        msgTitulo.innerHTML = 'SUCESSO';
    } else {
        bgPop.classList.add('bg-danger');
        msgTitulo.innerHTML = 'ERRO';
    }

    erroPlaca.style.display = 'block';
}

/* =============================================
   LISTAR VIAGENS DO MOTORISTA LOGADO
   ============================================= */
async function mostrarViagens() {
    try {
        const res = await fetch('/motorista/minhasViagens', {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (res.status === 404) {
            grid.innerHTML = '<div class="empty-state"><img src="/img/icons/viagem (2).png" alt=""><p>Nenhuma viagem encontrada.</p></div>';
            return;
        }

        if (!res.ok) {
            exibirFeedback(false, 'Erro ao carregar viagens.');
            return;
        }

        const resposta = await res.json();
        const viagens = resposta.dados || [];

        if (viagens.length === 0) {
            grid.innerHTML = '<div class="empty-state"><img src="/img/icons/viagem (2).png" alt=""><p>Nenhuma viagem encontrada.</p></div>';
            return;
        }

        const badgeMap = {
            'agendada': { classe: 'badge-agendada', label: 'Agendada' },
            'em andamento': { classe: 'badge-andamento', label: 'Em andamento' },
            'finalizada': { classe: 'badge-finalizada', label: 'Finalizada' },
            'cancelada': { classe: 'badge-cancelada', label: 'Cancelada' }
        };

        grid.innerHTML = '';

        viagens.forEach(viagem => {
            const statusKey = (viagem.status || '').toLowerCase();
            const badge = badgeMap[statusKey] || { classe: 'badge-agendada', label: viagem.status };
            const dataFormatada = formatarData(viagem.data_viagem);
            const horarioFormatado = viagem.horario_viagem ? viagem.horario_viagem.substring(0, 5) : '--:--';

            grid.insertAdjacentHTML('beforeend', `
                <div class="vehicle-card">
                    <div class="trip-header-visual">🚌</div>
                    <div class="vehicle-body">
                        <div class="vehicle-header">
                            <span class="vehicle-model">${viagem.origem || '-'} → ${viagem.destino || '-'}</span>
                            <span class="badge-status ${badge.classe}">${badge.label}</span>
                        </div>
                        <div class="vehicle-meta">Distância: <span>${viagem.distancia_km || '-'} km</span></div>
                        <div class="vehicle-meta">Veículo: <span>${viagem.modelo || '-'} (${viagem.placa || '-'})</span></div>
                        <div class="vehicle-meta">ID: <span>${viagem.id}</span></div>
                        <div class="vehicle-footer">
                            <div class="vehicle-stat">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                ${dataFormatada}
                            </div>
                            <div class="vehicle-stat">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                ${horarioFormatado}
                            </div>
                        </div>
                    </div>
                </div>
            `);
        });

    } catch (error) {
        console.error('Erro ao carregar viagens:', error);
        exibirFeedback(false, 'Erro ao carregar suas viagens.');
    }
}

/* =============================================
   UTILITÁRIO — FORMATAR DATA
   ============================================= */
function formatarData(dataISO) {
    if (!dataISO) return '--/--/----';
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
}

/* =============================================
   BUSCAR VIAGEM PARA ALTERAR STATUS
   ============================================= */
document.getElementById('btnBuscarStatus').addEventListener('click', async () => {
    const id = document.getElementById('inputIdStatus').value.trim();

    if (!id) {
        exibirFeedback(false, 'Informe o ID da viagem.');
        return;
    }

    try {
        const resposta = await fetch('/viagem/procurar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: parseInt(id) })
        });

        if (!resposta.ok) {
            exibirFeedback(false, 'Viagem não encontrada.');
            return;
        }

        const resposta_json = await resposta.json();
        const viagem = resposta_json.dados || resposta_json;

        document.getElementById('statusOrigem').textContent = viagem.origem || '--';
        document.getElementById('statusDestino').textContent = viagem.destino || '--';
        document.getElementById('statusVeiculo').textContent = `${viagem.modelo || '--'} (${viagem.placa || '--'})`;
        document.getElementById('statusData').textContent = formatarData(viagem.data_viagem);
        document.getElementById('statusHorario').textContent = viagem.horario_viagem ? viagem.horario_viagem.substring(0, 5) : '--:--';
        document.getElementById('statusAtual').textContent = viagem.status || '--';

        document.getElementById('resumoStatus').style.display = 'block';
        document.getElementById('acoesBotoes').style.display = 'block';
        document.getElementById('btnBuscarStatus').style.display = 'none';

        // Reseta botões
        document.getElementById('btnIniciar').style.display = 'none';
        document.getElementById('btnFinalizar').style.display = 'none';
        document.getElementById('msgSemAcao').style.display = 'none';

        const statusAtual = (viagem.status || '').trim();

        if (statusAtual === 'Agendada') {
            document.getElementById('btnIniciar').style.display = 'block';
        } else if (statusAtual === 'Em andamento') {
            document.getElementById('btnFinalizar').style.display = 'block';
        } else {
            document.getElementById('msgSemAcao').style.display = 'block';
        }

        document.getElementById('btnIniciar').dataset.viagemId = id;
        document.getElementById('btnFinalizar').dataset.viagemId = id;

    } catch (error) {
        console.error('Erro ao buscar viagem:', error);
        exibirFeedback(false, 'Erro ao buscar a viagem.');
    }
});

/* =============================================
   INICIAR VIAGEM — Agendada → Em andamento
   ============================================= */
document.getElementById('btnIniciar').addEventListener('click', async (e) => {
    const id = e.target.dataset.viagemId;

    try {
        const resposta = await fetch('/viagem/alterar-status', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: parseInt(id), novoStatus: 'Em andamento', tipoUsuario: 'Motorista' })
        });

        const dados = await resposta.json();
        modalEdit.style.display = 'none';
        exibirFeedback(dados.sucesso, dados.mensagem);

        if (dados.sucesso) {
            grid.innerHTML = '';
            mostrarViagens();
        }

    } catch (error) {
        exibirFeedback(false, 'Erro ao iniciar a viagem.');
    }
});

/* =============================================
   FINALIZAR VIAGEM — Em andamento → Finalizada
   ============================================= */
document.getElementById('btnFinalizar').addEventListener('click', async (e) => {
    const id = e.target.dataset.viagemId;

    try {
        const resposta = await fetch('/viagem/alterar-status', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: parseInt(id), novoStatus: 'Finalizada', tipoUsuario: 'Motorista' })
        });

        const dados = await resposta.json();
        modalEdit.style.display = 'none';
        exibirFeedback(dados.sucesso, dados.mensagem);

        if (dados.sucesso) {
            grid.innerHTML = '';
            mostrarViagens();
        }

    } catch (error) {
        exibirFeedback(false, 'Erro ao finalizar a viagem.');
    }
});
