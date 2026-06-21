mostrarVeiculos();

/* =============================================
   REFERÊNCIAS DOM
   ============================================= */
const grid      = document.querySelector('.vehicles-grid');
const modal     = document.getElementById('modal');
const modalEx   = document.getElementById('modalEx');
const modalEdit = document.getElementById('modalEdit');
const erroPlaca = document.getElementById('erroPlaca');
const excluirBtn = document.getElementById('excluirBtn');

/* =============================================
   PESQUISA LOCAL (filtra os cards já renderizados)
   ============================================= */
document.getElementById('btnPesquisar').addEventListener('click', filtrarVeiculos);
document.getElementById('campoPesquisa').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') filtrarVeiculos();
});

function filtrarVeiculos() {
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

// Adicionar
document.getElementById('abrirModal').addEventListener('click', () => {
    modal.style.display = 'block';
});
document.getElementById('fecharModal').addEventListener('click', () => {
    modal.style.display = 'none';
});

// Excluir
document.getElementById('abrirModalEx').addEventListener('click', () => {
    modalEx.style.display = 'block';
});
document.getElementById('fecharModalEx').addEventListener('click', () => {
    modalEx.style.display = 'none';
});

// Editar
document.getElementById('abrirModalEdit').addEventListener('click', () => {
    modalEdit.style.display = 'block';
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
function exibirFeedback(status, mensagem) {
    const bgPop     = document.getElementById('bgPop');
    const msgTitulo = document.getElementById('msgTitulo');

    document.getElementById('msgErro').innerHTML = mensagem;

    bgPop.classList.remove('bg-success', 'bg-danger');

    if (status === 'sucesso') {
        bgPop.classList.add('bg-success');
        msgTitulo.innerHTML = 'SUCESSO';
    } else {
        bgPop.classList.add('bg-danger');
        msgTitulo.innerHTML = 'ERRO';
    }

    erroPlaca.style.display = 'block';
}

/* =============================================
   LISTAR VEÍCULOS
   → POST /veiculo/listar
   ============================================= */
async function mostrarVeiculos() {
    const dados = await fetch('/veiculo/listar', {
        method: 'POST'
    });

    // 404 significa lista vazia — não é erro real
    if (dados.status === 404) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #888; padding: 40px 0;">Nenhum veículo cadastrado.</div>';
        return;
    }

    if (!dados.ok) {
        exibirFeedback('erro', 'Erro ao carregar veículos.');
        return;
    }

    const veiculos = await dados.json();

    // Mapeia o status do banco para a classe CSS e label corretos
    const badgeMap = {
        'disponivel':    { classe: 'badge-disponivel', label: 'Disponível' },
        'em operacao':   { classe: 'badge-operacao',   label: 'Em operação' },
        'manutencao':    { classe: 'badge-manutencao', label: 'Manutenção' },
        'fora de servico':{ classe: 'badge-fora',      label: 'Fora de serviço' }
    };

    veiculos.forEach(veiculo => {
        const statusKey = (veiculo.status || '').toLowerCase();
        const badge = badgeMap[statusKey] || { classe: 'badge-disponivel', label: veiculo.status };

        grid.insertAdjacentHTML('beforeend', `
            <div class="vehicle-card">
                <img class="vehicle-img" src="img/bus.gif" alt="${veiculo.modelo}"
                    onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                <div class="vehicle-img-placeholder" style="display:none;">🚌</div>
                <div class="vehicle-body">
                    <div class="vehicle-header">
                        <span class="vehicle-model">${veiculo.modelo}</span>
                        <span class="badge-status ${badge.classe}">${badge.label}</span>
                    </div>
                    <div class="vehicle-meta">Marca: <span>${veiculo.marca}</span></div>
                    <div class="vehicle-meta">Placa: <span>${veiculo.placa}</span></div>
                    <div class="vehicle-footer">
                        <div class="vehicle-stat">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                            </svg>
                            ${veiculo.capacidade_passageiros} passageiros
                        </div>
                        <div class="vehicle-stat">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            ${veiculo.quilometragem} km
                        </div>
                    </div>
                </div>
            </div>
        `);
    });
}


/* =============================================
   CADASTRAR VEÍCULO
   → POST /veiculo/adicionar
   ============================================= */
document.getElementById('formAdicionar').addEventListener('submit', async (e) => {
    e.preventDefault();

    const modelo         = document.querySelector('#formAdicionar input[name="modelo"]').value.trim();
    const marca          = document.querySelector('#formAdicionar input[name="marca"]').value.trim();
    const placa          = document.querySelector('#formAdicionar input[name="placa"]').value.trim();
    const ano            = document.querySelector('#formAdicionar input[name="ano"]').value.trim();
    const capacidade     = document.querySelector('#formAdicionar input[name="capacidade_passageiros"]').value.trim();
    const quilometragem  = document.querySelector('#formAdicionar input[name="quilometragem"]').value.trim();

    try {
        const resposta = await fetch('/veiculo/adicionar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ modelo, marca, placa, ano, capacidade_passageiros: capacidade, quilometragem })
        });

        const dados = await resposta.json();

        modal.style.display = 'none';
        exibirFeedback(dados.status, dados.menssagem);

        if (dados.status === 'sucesso') {
            grid.innerHTML = '';
            mostrarVeiculos();
        }

    } catch (error) {
        console.error('Erro ao cadastrar veículo:', error);
        exibirFeedback('erro', 'Erro ao tentar cadastrar o veículo.');
    }
});

/* =============================================
   EXCLUIR VEÍCULO
   → POST /veiculo/deletar
   ============================================= */
document.getElementById('formExcluir').addEventListener('submit', async (e) => {
    e.preventDefault();

    const placa = document.querySelector('#formExcluir input[name="placa"]').value;

    const resposta = await fetch('/veiculo/deletar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placa })
    });

    const dados = await resposta.json();

    console.log(dados);

    if (dados) {
        modalEx.style.display = 'none';
        exibirFeedback(dados.status, dados.menssagem);

        if (dados.status === 'sucesso') {
            grid.innerHTML = '';
            mostrarVeiculos();
        }
    }
});

/* =============================================
   EDITAR VEÍCULO
   → PUT /veiculo/atualizar
   Localiza pelo placa e atualiza os campos
   preenchidos. Campos vazios mantêm o valor
   atual buscado do banco antes de salvar.
   ============================================= */
document.getElementById('formEditar').addEventListener('submit', async (e) => {
    e.preventDefault();

    const placa               = document.querySelector('#formEditar input[name="placa"]').value.trim();
    const modelo              = document.querySelector('#formEditar input[name="modelo"]').value.trim();
    const marca               = document.querySelector('#formEditar input[name="marca"]').value.trim();
    const ano                 = document.querySelector('#formEditar input[name="ano"]').value.trim();
    const capacidade          = document.querySelector('#formEditar input[name="capacidade_passageiros"]').value.trim();
    const quilometragem       = document.querySelector('#formEditar input[name="quilometragem"]').value.trim();
    const status              = document.querySelector('#formEditar select[name="status"]').value;

    // 1. Busca os dados atuais do veículo para não sobrescrever campos vazios com nulo
    const buscaResposta = await fetch('/veiculo/procurar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placa })
    });

    if (!buscaResposta.ok) {
        exibirFeedback('erro', 'Placa não encontrada. Verifique e tente novamente.');
        return;
    }

    const atual = await buscaResposta.json();

    // 2. Monta o payload: usa o novo valor se preenchido, senão mantém o atual
    const payload = {
        placa,
        modelo:                 modelo        || atual.modelo,
        marca:                  marca         || atual.marca,
        ano:                    ano           || atual.ano,
        capacidade_passageiros: capacidade    || atual.capacidade_passageiros,
        quilometragem:          quilometragem || atual.quilometragem,
        status:                 status        || atual.status,
    };

    // 3. Envia a atualização
    console.log('Payload enviado para atualizar:', payload);

    const resposta = await fetch('/veiculo/atualizar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    console.log('Status da resposta:', resposta.status);

    const dados = await resposta.json();

    console.log('Resposta do servidor:', dados);

    modalEdit.style.display = 'none';
    exibirFeedback(dados.status, dados.menssagem);

    if (dados.status === 'sucesso') {
        grid.innerHTML = '';
        mostrarVeiculos();
    }
});
