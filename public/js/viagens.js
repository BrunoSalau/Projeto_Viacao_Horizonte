/* =============================================
   INICIALIZAÇÃO
   ============================================= */
let ID_SUPERVISOR_LOGADO = 1; // será preenchido dinamicamente

// Obter dados do usuário logado ao carregar a página
async function obterDadosUsuario() {
    try {
        // Tente buscar /usuario/perfil ou a rota que você usa para obter o usuário logado
        const resposta = await fetch('/usuario/perfil', {
            method: 'GET'
        });
        
        if (resposta.ok) {
            const dados = await resposta.json();
            // Ajuste os campos conforme sua estrutura de resposta
            ID_SUPERVISOR_LOGADO = dados.dados?.id || dados.id || 1;
            console.log('ID do supervisor logado:', ID_SUPERVISOR_LOGADO);
        } else {
            console.log('Não foi possível obter usuário logado, usando ID padrão: 1');
        }
    } catch (error) {
        console.error('Erro ao obter dados do usuário:', error);
        // Mantém o padrão 1 se der erro
    }
}

// Chamar ao inicializar
obterDadosUsuario();

// Depois carregar as viagens
mostrarViagens();
carregarRotas();
carregarVeiculos();
carregarMotoristas();

/* =============================================
   REFERÊNCIAS DOM
   ============================================= */
const grid              = document.getElementById('gridViagens');
const modal             = document.getElementById('modal');
const modalEx           = document.getElementById('modalEx');
const modalEdit         = document.getElementById('modalEdit');
const erroPlaca         = document.getElementById('erroPlaca');
const selectRota        = document.getElementById('selectRota');
const selectVeiculo     = document.getElementById('selectVeiculo');
const selectMotorista   = document.getElementById('selectMotorista');

/* =============================================
   PESQUISA LOCAL (filtra os cards já renderizados)
   ============================================= */
document.getElementById('btnPesquisar').addEventListener('click', filtrarViagens);
document.getElementById('campoPesquisa').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') filtrarViagens();
});

function filtrarViagens() {
    const termo = document.getElementById('campoPesquisa').value.toLowerCase().trim();
    const cards = grid.querySelectorAll('.vehicle-card');

    cards.forEach(card => {
        const texto = card.innerText.toLowerCase();
        card.style.display = texto.includes(termo) ? '' : 'none';
    });
}

/* =============================================
   MODAIS — ABRIR / FECHAR
   ============================================= */

// Agendar
document.getElementById('abrirModal').addEventListener('click', () => {
    modal.style.display = 'block';
});
document.getElementById('fecharModal').addEventListener('click', () => {
    modal.style.display = 'none';
});

// Cancelar
document.getElementById('abrirModalEx').addEventListener('click', () => {
    modalEx.style.display = 'block';
    document.getElementById('resumoCancelar').style.display = 'none';
    document.getElementById('btnConfirmarCancelar').style.display = 'none';
    document.getElementById('inputIdCancelar').value = '';
});
document.getElementById('fecharModalEx').addEventListener('click', () => {
    modalEx.style.display = 'none';
});

// Alterar Status
document.getElementById('abrirModalEdit').addEventListener('click', () => {
    modalEdit.style.display = 'block';
    document.getElementById('resumoStatus').style.display = 'none';
    document.getElementById('acoesBotoes').style.display = 'none';
    document.getElementById('inputIdStatus').value = '';
});
document.getElementById('fecharModalEdit').addEventListener('click', () => {
    modalEdit.style.display = 'none';
});

// Fechar feedback
document.getElementById('fecharErroPlaca').addEventListener('click', () => {
    erroPlaca.style.display = 'none';
});
document.getElementById('fecharErroPlacaBtn').addEventListener('click', () => {
    erroPlaca.style.display = 'none';
});

// Fechar ao clicar fora do conteúdo
window.addEventListener('click', (e) => {
    if (e.target === modal)     modal.style.display     = 'none';
    if (e.target === modalEx)   modalEx.style.display   = 'none';
    if (e.target === modalEdit) modalEdit.style.display = 'none';
    if (e.target === erroPlaca) erroPlaca.style.display = 'none';
});

/* =============================================
   FEEDBACK POPUP
   ============================================= */
function exibirFeedback(sucesso, mensagem) {
    const bgPop     = document.getElementById('bgPop');
    const msgTitulo = document.getElementById('msgTitulo');
    const msgErro   = document.getElementById('msgErro');

    msgErro.innerHTML = mensagem;

    bgPop.classList.remove('bg-success', 'bg-danger');

    if (sucesso === true) {
        bgPop.classList.add('bg-success');
        msgTitulo.innerHTML = 'SUCESSO';
    } else {
        bgPop.classList.add('bg-danger');
        msgTitulo.innerHTML = 'ERRO';
    }

    erroPlaca.style.display = 'block';
}

/* =============================================
   LISTAR VIAGENS COM JOINS
   → GET /viagem/listar
   ============================================= */
async function mostrarViagens() {
    try {
        const dados = await fetch('/viagem/listar', {
            method: 'GET'
        });

        // 404 significa lista vazia — não é erro real
        if (dados.status === 404) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #888; padding: 40px 0;">Nenhuma viagem cadastrada.</div>';
            return;
        }

        if (!dados.ok) {
            exibirFeedback(false, 'Erro ao carregar viagens.');
            return;
        }

        // FIX: Extrair o array de dados do objeto resposta
        const resposta = await dados.json();
        const viagens = resposta.dados || [];

        // Mapeia os status para classes CSS e labels corretos
        const badgeMap = {
            'agendada':     { classe: 'badge-agendada',   label: 'Agendada' },
            'em andamento': { classe: 'badge-andamento',  label: 'Em andamento' },
            'finalizada':   { classe: 'badge-finalizada', label: 'Finalizada' },
            'cancelada':    { classe: 'badge-cancelada',  label: 'Cancelada' }
        };

        viagens.forEach(viagem => {
            const statusKey = (viagem.status || '').toLowerCase();
            const badge = badgeMap[statusKey] || { classe: 'badge-agendada', label: viagem.status };

            // Formata data para exibição (YYYY-MM-DD → DD/MM/YYYY)
            const dataFormatada = formatarData(viagem.data_viagem);
            
            // Formata horário (HH:mm:ss → HH:mm)
            const horarioFormatado = viagem.horario_viagem ? viagem.horario_viagem.substring(0, 5) : '--:--';

            grid.insertAdjacentHTML('beforeend', `
                <div class="vehicle-card">
                    <div class="trip-header-visual">🚌</div>
                    <div class="vehicle-body">
                        <div class="vehicle-header">
                            <span class="vehicle-model">${viagem.origem} → ${viagem.destino}</span>
                            <span class="badge-status ${badge.classe}">${badge.label}</span>
                        </div>
                        <div class="vehicle-meta">Distância: <span>${viagem.distancia_km} km</span></div>
                        <div class="vehicle-meta">Motorista: <span>${viagem.nome_motorista}</span></div>
                        <div class="vehicle-meta">Veículo: <span>${viagem.modelo} (${viagem.placa})</span></div>
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
        exibirFeedback(false, 'Erro ao carregar a lista de viagens.');
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
   CARREGAR ROTAS PARA SELECT
   → POST /viagem/rotas
   ============================================= */
async function carregarRotas() {
    try {
        const resposta = await fetch('/viagem/rotas', {
            method: 'POST'
        });

        if (!resposta.ok) {
            console.error('Erro ao carregar rotas');
            return;
        }

        const rotas = await resposta.json();

        // Se a resposta tem campo 'dados', use ele; senão, use a resposta direto
        const rotasArray = Array.isArray(rotas) ? rotas : rotas.dados || [];

        rotasArray.forEach(rota => {
            const option = document.createElement('option');
            option.value = rota.id;
            option.textContent = `${rota.origem} → ${rota.destino} (${rota.distancia_km} km)`;
            selectRota.appendChild(option);
        });

    } catch (error) {
        console.error('Erro ao carregar rotas:', error);
    }
}

/* =============================================
   CARREGAR VEÍCULOS DISPONÍVEIS PARA SELECT
   → POST /viagem/veiculos
   Filtra automaticamente veículos em manutenção
   ============================================= */
async function carregarVeiculos() {
    try {
        const resposta = await fetch('/viagem/veiculos', {
            method: 'POST'
        });

        if (!resposta.ok) {
            console.error('Erro ao carregar veículos');
            return;
        }

        const veiculos = await resposta.json();

        // Se a resposta tem campo 'dados', use ele; senão, use a resposta direto
        const veiculosArray = Array.isArray(veiculos) ? veiculos : veiculos.dados || [];

        veiculosArray.forEach(veiculo => {
            const option = document.createElement('option');
            option.value = veiculo.id;
            option.textContent = `${veiculo.modelo} - ${veiculo.placa}`;
            selectVeiculo.appendChild(option);
        });

    } catch (error) {
        console.error('Erro ao carregar veículos:', error);
    }
}

/* =============================================
   CARREGAR MOTORISTAS PARA SELECT
   → POST /viagem/motoristas
   ============================================= */
async function carregarMotoristas() {
    try {
        const resposta = await fetch('/viagem/motoristas', {
            method: 'POST'
        });

        if (!resposta.ok) {
            console.error('Erro ao carregar motoristas');
            return;
        }

        const motoristas = await resposta.json();

        // Se a resposta tem campo 'dados', use ele; senão, use a resposta direto
        const motoristasArray = Array.isArray(motoristas) ? motoristas : motoristas.dados || [];

        motoristasArray.forEach(motorista => {
            const option = document.createElement('option');
            option.value = motorista.id;
            option.textContent = `${motorista.nome} - ${motorista.cpf}`;
            selectMotorista.appendChild(option);
        });

    } catch (error) {
        console.error('Erro ao carregar motoristas:', error);
    }
}

/* =============================================
   AGENDAR VIAGEM
   → POST /viagem/adicionar
   ============================================= */
document.getElementById('formAdicionar').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id_rota        = document.querySelector('#formAdicionar select[name="id_rota"]').value.trim();
    const id_veiculo     = document.querySelector('#formAdicionar select[name="id_veiculo"]').value.trim();
    const id_motorista   = document.querySelector('#formAdicionar select[name="id_motorista"]').value.trim();
    const data_viagem    = document.querySelector('#formAdicionar input[name="data_viagem"]').value.trim();
    const horario_viagem = document.querySelector('#formAdicionar input[name="horario_viagem"]').value.trim();

    // FIX: Usar ID do supervisor obtido dinamicamente
    const id_supervisor = ID_SUPERVISOR_LOGADO;

    try {
        const resposta = await fetch('/viagem/adicionar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id_rota: parseInt(id_rota),
                id_veiculo: parseInt(id_veiculo),
                id_motorista: parseInt(id_motorista),
                data_viagem,
                horario_viagem,
                id_supervisor
            })
        });

        const dados = await resposta.json();

        modal.style.display = 'none';
        exibirFeedback(dados.sucesso, dados.mensagem);

        if (dados.sucesso === true) {
            document.getElementById('formAdicionar').reset();
            grid.innerHTML = '';
            mostrarViagens();
        }

    } catch (error) {
        console.error('Erro ao agendar viagem:', error);
        exibirFeedback(false, 'Erro ao tentar agendar a viagem.');
    }
});

/* =============================================
   BUSCAR VIAGEM PARA CANCELAR (Modal Cancelar)
   → POST /viagem/procurar
   ============================================= */
    document.getElementById('btnBuscarCancelar').addEventListener('click', async () => {
    const id = document.getElementById('inputIdCancelar').value.trim();
 
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
        // Verifica se a resposta tem "dados" dentro ou é direto o objeto
        const viagem = resposta_json.dados || resposta_json;
 
        // DEBUG: Mostrar no console
        console.log('Viagem encontrada:', viagem);
        console.log('Origem:', viagem.origem);
        console.log('Destino:', viagem.destino);
        console.log('Motorista:', viagem.nome_motorista);
        console.log('Modelo:', viagem.modelo);
        console.log('Placa:', viagem.placa);
 
        // Preenche o resumo com validação
        const origem = viagem.origem || '--';
        const destino = viagem.destino || '--';
        const motorista = viagem.nome_motorista || '--';
        const modelo = viagem.modelo || '--';
        const placa = viagem.placa || '--';
        const veiculo = `${modelo} (${placa})`;
        const data = formatarData(viagem.data_viagem);
        const horario = viagem.horario_viagem ? viagem.horario_viagem.substring(0, 5) : '--:--';
        const status = viagem.status || '--';
 
        document.getElementById('cancelarOrigem').textContent = origem;
        document.getElementById('cancelarDestino').textContent = destino;
        document.getElementById('cancelarMotorista').textContent = motorista;
        document.getElementById('cancelarVeiculo').textContent = veiculo;
        document.getElementById('cancelarData').textContent = data;
        document.getElementById('cancelarHorario').textContent = horario;
        document.getElementById('cancelarStatus').textContent = status;
 
        document.getElementById('resumoCancelar').style.display = 'block';
        document.getElementById('btnConfirmarCancelar').style.display = 'block';
        document.getElementById('btnBuscarCancelar').style.display = 'none';
 
    } catch (error) {
        console.error('Erro ao buscar viagem:', error);
        exibirFeedback(false, 'Erro ao buscar a viagem.');
    }
});
 
   
   
   /*document.getElementById('btnBuscarCancelar').addEventListener('click', async () => {
    const id = document.getElementById('inputIdCancelar').value.trim();

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

        const viagem = await resposta.json();

        // Preenche o resumo
        document.getElementById('cancelarOrigem').textContent = viagem.origem || '--';
        document.getElementById('cancelarDestino').textContent = viagem.destino || '--';
        document.getElementById('cancelarMotorista').textContent = viagem.nome_motorista || '--';
        document.getElementById('cancelarVeiculo').textContent = `${viagem.modelo} (${viagem.placa})` || '--';
        document.getElementById('cancelarData').textContent = formatarData(viagem.data_viagem);
        document.getElementById('cancelarHorario').textContent = viagem.horario_viagem ? viagem.horario_viagem.substring(0, 5) : '--:--';
        document.getElementById('cancelarStatus').textContent = viagem.status || '--';

        document.getElementById('resumoCancelar').style.display = 'block';
        document.getElementById('btnConfirmarCancelar').style.display = 'block';
        document.getElementById('btnBuscarCancelar').style.display = 'none';

    } catch (error) {
        console.error('Erro ao buscar viagem:', error);
        exibirFeedback(false, 'Erro ao buscar a viagem.');
    }
});*/

/* =============================================
   CANCELAR VIAGEM
   → POST /viagem/deletar
   ============================================= */
document.getElementById('formExcluir').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('inputIdCancelar').value.trim();

    if (!confirm('Tem certeza que deseja cancelar esta viagem?')) {
        return;
    }

    try {
        const resposta = await fetch('/viagem/deletar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: parseInt(id) })
        });

        const dados = await resposta.json();

        modalEx.style.display = 'none';
        exibirFeedback(dados.sucesso, dados.mensagem);

        if (dados.sucesso === true) {
            grid.innerHTML = '';
            mostrarViagens();
        }

    } catch (error) {
        console.error('Erro ao cancelar viagem:', error);
        exibirFeedback(false, 'Erro ao tentar cancelar a viagem.');
    }
});

/* =============================================
   BUSCAR VIAGEM PARA ALTERAR STATUS (Modal Alterar Status)
   → POST /viagem/procurar
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
        // Verifica se a resposta tem "dados" dentro ou é direto o objeto
        const viagem = resposta_json.dados || resposta_json;

        // DEBUG: Mostrar no console qual é o status
        console.log('Status da viagem:', viagem.status);

        // Preenche o resumo
        document.getElementById('statusOrigem').textContent = viagem.origem || '--';
        document.getElementById('statusDestino').textContent = viagem.destino || '--';
        document.getElementById('statusMotorista').textContent = viagem.nome_motorista || '--';
        document.getElementById('statusVeiculo').textContent = `${viagem.modelo} (${viagem.placa})` || '--';
        document.getElementById('statusData').textContent = formatarData(viagem.data_viagem);
        document.getElementById('statusHorario').textContent = viagem.horario_viagem ? viagem.horario_viagem.substring(0, 5) : '--:--';
        document.getElementById('statusAtual').textContent = viagem.status || '--';

        document.getElementById('resumoStatus').style.display = 'block';
        document.getElementById('acoesBotoes').style.display = 'block';
        document.getElementById('btnBuscarStatus').style.display = 'none';

        // Limpa os botões
        document.getElementById('btnIniciar').style.display = 'none';
        document.getElementById('btnFinalizar').style.display = 'none';
        document.getElementById('btnCancelarStatus').style.display = 'none';

        // Normaliza o status (remove espaços extras e converte para comparação)
        const statusAtual = (viagem.status || '').trim();

        console.log('Status normalizado:', statusAtual);
        console.log('Tipo de usuário:', 'Motorista');

        // Lógica: Motorista pode iniciar (Agendada → Em andamento) ou finalizar (Em andamento → Finalizada)
        // Supervisor pode cancelar (Agendada → Cancelada)
        const tipoUsuario = 'Motorista'; // TODO: obter do servidor

        // Mostra os botões conforme o status
        if (tipoUsuario === 'Motorista') {
            if (statusAtual === 'Agendada') {
                console.log('Mostrando botão Iniciar');
                document.getElementById('btnIniciar').style.display = 'block';
            } else if (statusAtual === 'Em andamento') {
                console.log('Mostrando botão Finalizar');
                document.getElementById('btnFinalizar').style.display = 'block';
            } else {
                console.log('Status não permite ação de motorista:', statusAtual);
            }
        } else if (tipoUsuario === 'Supervisor') {
            if (statusAtual === 'Agendada') {
                console.log('Mostrando botão Cancelar');
                document.getElementById('btnCancelarStatus').style.display = 'block';
            }
        }

        // Armazena o ID da viagem para os botões de ação
        document.getElementById('btnIniciar').dataset.viagemId = id;
        document.getElementById('btnFinalizar').dataset.viagemId = id;
        document.getElementById('btnCancelarStatus').dataset.viagemId = id;

    } catch (error) {
        console.error('Erro ao buscar viagem:', error);
        exibirFeedback(false, 'Erro ao buscar a viagem.');
    }
});

/* =============================================
   ALTERAR STATUS — INICIAR VIAGEM
   Agendada → Em andamento
   ============================================= */
document.getElementById('btnIniciar').addEventListener('click', async (e) => {
    const id = e.target.dataset.viagemId;

    try {
        const resposta = await fetch('/viagem/alterar-status', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id: parseInt(id),
                novoStatus: 'Em andamento',
                tipoUsuario: 'Motorista'
            })
        });

        const dados = await resposta.json();

        modalEdit.style.display = 'none';
        exibirFeedback(dados.sucesso, dados.mensagem);

        if (dados.sucesso === true) {
            grid.innerHTML = '';
            mostrarViagens();
        }

    } catch (error) {
        console.error('Erro ao alterar status:', error);
        exibirFeedback(false, 'Erro ao tentar alterar o status da viagem.');
    }
});

/* =============================================
   ALTERAR STATUS — FINALIZAR VIAGEM
   Em andamento → Finalizada
   ============================================= */
document.getElementById('btnFinalizar').addEventListener('click', async (e) => {
    const id = e.target.dataset.viagemId;

    try {
        const resposta = await fetch('/viagem/alterar-status', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id: parseInt(id),
                novoStatus: 'Finalizada',
                tipoUsuario: 'Motorista'
            })
        });

        const dados = await resposta.json();

        modalEdit.style.display = 'none';
        exibirFeedback(dados.sucesso, dados.mensagem);

        if (dados.sucesso === true) {
            grid.innerHTML = '';
            mostrarViagens();
        }

    } catch (error) {
        console.error('Erro ao alterar status:', error);
        exibirFeedback(false, 'Erro ao tentar finalizar a viagem.');
    }
});

/* =============================================
   ALTERAR STATUS — CANCELAR VIAGEM (Supervisor)
   Agendada → Cancelada
   ============================================= */
document.getElementById('btnCancelarStatus').addEventListener('click', async (e) => {
    const id = e.target.dataset.viagemId;

    if (!confirm('Tem certeza que deseja cancelar esta viagem?')) {
        return;
    }

    try {
        const resposta = await fetch('/viagem/alterar-status', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id: parseInt(id),
                novoStatus: 'Cancelada',
                tipoUsuario: 'Supervisor'
            })
        });

        const dados = await resposta.json();

        modalEdit.style.display = 'none';
        exibirFeedback(dados.sucesso, dados.mensagem);

        if (dados.sucesso === true) {
            grid.innerHTML = '';
            mostrarViagens();
        }

    } catch (error) {
        console.error('Erro ao alterar status:', error);
        exibirFeedback(false, 'Erro ao tentar cancelar a viagem.');
    }
});
