mostrarAbastecimentos();
carregarVeiculos();

/* =============================================
   REFERÊNCIAS DOM
   ============================================= */
const grid              = document.querySelector('.vehicles-grid');
const modal              = document.getElementById('modal');
const modalEx            = document.getElementById('modalEx');
const modalEdit          = document.getElementById('modalEdit');
const erroPlaca          = document.getElementById('erroPlaca');
const excluirBtn         = document.getElementById('excluirBtn');
const selectVeiculo      = document.getElementById('selectVeiculo');
const selectVeiculoEdit  = document.getElementById('selectVeiculoEdit');

/* =============================================
   PESQUISA LOCAL (filtra os cards já renderizados)
   ============================================= */
document.getElementById('btnPesquisar').addEventListener('click', filtrarAbastecimentos);
document.getElementById('campoPesquisa').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') filtrarAbastecimentos();
});

function filtrarAbastecimentos() {
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
   CARREGAR VEÍCULOS PARA OS SELECTS
   → POST /veiculo/listar
   ============================================= */
async function carregarVeiculos() {
    try {
        const resposta = await fetch('/veiculo/listar', {
            method: 'POST'
        });

        if (!resposta.ok) {
            console.error('Erro ao carregar veículos');
            return;
        }

        const veiculos = await resposta.json();
        const veiculosArray = Array.isArray(veiculos) ? veiculos : veiculos.dados || [];

        veiculosArray.forEach(veiculo => {
            const option = document.createElement('option');
            option.value = veiculo.id;
            option.textContent = `${veiculo.modelo} - ${veiculo.placa}`;
            selectVeiculo.appendChild(option);

            const optionEdit = document.createElement('option');
            optionEdit.value = veiculo.id;
            optionEdit.textContent = `${veiculo.modelo} - ${veiculo.placa}`;
            selectVeiculoEdit.appendChild(optionEdit);
        });

    } catch (error) {
        console.error('Erro ao carregar veículos:', error);
    }
}

/* =============================================
   LISTAR ABASTECIMENTOS
   → POST /abastecimento/listar
   ============================================= */
async function mostrarAbastecimentos() {
    const dados = await fetch('/abastecimento/listar', {
        method: 'POST'
    });

    // 404 significa lista vazia — não é erro real
    if (dados.status === 404) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #888; padding: 40px 0;">Nenhum abastecimento cadastrado.</div>';
        return;
    }

    if (!dados.ok) {
        exibirFeedback('erro', 'Erro ao carregar abastecimentos.');
        return;
    }

    const abastecimentos = await dados.json();

    abastecimentos.forEach((abastecimento) => {
        const dataFormatada = abastecimento.data_abastecimento
            ? new Date(abastecimento.data_abastecimento).toLocaleDateString('pt-BR')
            : '-';

        const veiculoLabel = abastecimento.placa
            ? `${abastecimento.modelo} - ${abastecimento.placa}`
            : `Veículo #${abastecimento.id_veiculo}`;

        const valorFormatado = Number(abastecimento.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        grid.insertAdjacentHTML('beforeend', `
            <div class="vehicle-card">
                <div class="route-icon-container">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f5c518" stroke-width="2">
                        <line x1="3" y1="22" x2="15" y2="22"/>
                        <line x1="4" y1="9" x2="14" y2="9"/>
                        <path d="M4 22V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v18"/>
                        <path d="M14 9h2a2 2 0 0 1 2 2v6a1.5 1.5 0 0 0 3 0V10a1 1 0 0 0-.3-.7l-2.7-2.6"/>
                    </svg>
                </div>
                <div class="vehicle-body">
                    <div class="vehicle-header">
                        <span class="vehicle-model">Abastecimento #${abastecimento.id}</span>
                        <span class="badge-status badge-ativo">Concluído</span>
                    </div>
                    <div class="vehicle-meta">Veículo: <span>${veiculoLabel}</span></div>
                    <div class="vehicle-meta">Litros: <span>${abastecimento.litros} L</span></div>
                    <div class="vehicle-meta">Valor: <span>${valorFormatado}</span></div>
                    <div class="vehicle-footer">
                        <div class="vehicle-stat">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            ${dataFormatada}
                        </div>
                        <div class="vehicle-stat">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            ID: ${abastecimento.id}
                        </div>
                    </div>
                </div>
            </div>
        `);
    });
}


/* =============================================
   CADASTRAR ABASTECIMENTO
   → POST /abastecimento/adicionar
   ============================================= */
document.getElementById('formAdicionar').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id_veiculo          = document.querySelector('#formAdicionar select[name="id_veiculo"]').value;
    const litros              = document.querySelector('#formAdicionar input[name="litros"]').value.trim();
    const valor               = document.querySelector('#formAdicionar input[name="valor"]').value.trim();
    const data_abastecimento  = document.querySelector('#formAdicionar input[name="data_abastecimento"]').value;

    try {
        const resposta = await fetch('/abastecimento/adicionar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_veiculo, litros, valor, data_abastecimento })
        });

        const dados = await resposta.json();

        modal.style.display = 'none';
        exibirFeedback(dados.status, dados.menssagem);

        if (dados.status === 'sucesso') {
            grid.innerHTML = '';
            mostrarAbastecimentos();
        }

    } catch (error) {
        console.error('Erro ao cadastrar abastecimento:', error);
        exibirFeedback('erro', 'Erro ao tentar cadastrar o abastecimento.');
    }
});

/* =============================================
   EXCLUIR ABASTECIMENTO
   → POST /abastecimento/deletar
   ============================================= */
document.getElementById('formExcluir').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.querySelector('#formExcluir input[name="id"]').value;

    const resposta = await fetch('/abastecimento/deletar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });

    const dados = await resposta.json();

    console.log(dados);

    if (dados) {
        modalEx.style.display = 'none';
        exibirFeedback(dados.status, dados.menssagem);

        if (dados.status === 'sucesso') {
            grid.innerHTML = '';
            mostrarAbastecimentos();
        }
    }
});

/* =============================================
   EDITAR ABASTECIMENTO
   → PUT /abastecimento/atualizar
   Localiza pelo ID e atualiza os campos
   preenchidos. Campos vazios mantêm o valor
   atual buscado do banco antes de salvar.
   ============================================= */
document.getElementById('formEditar').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id                  = document.querySelector('#formEditar input[name="id"]').value.trim();
    const id_veiculo          = document.querySelector('#formEditar select[name="id_veiculo"]').value;
    const litros              = document.querySelector('#formEditar input[name="litros"]').value.trim();
    const valor               = document.querySelector('#formEditar input[name="valor"]').value.trim();
    const data_abastecimento  = document.querySelector('#formEditar input[name="data_abastecimento"]').value;

    try {
        // 1. Busca os dados atuais do abastecimento para não sobrescrever campos vazios com nulo
        const buscaResposta = await fetch('/abastecimento/procurar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });

        if (!buscaResposta.ok) {
            exibirFeedback('erro', 'ID não encontrado. Verifique e tente novamente.');
            return;
        }

        const atual = await buscaResposta.json();

        // 2. Monta o payload: usa o novo valor se preenchido, senão mantém o atual
        const payload = {
            id,
            id_veiculo:         id_veiculo         || atual.id_veiculo,
            litros:              litros             || atual.litros,
            valor:               valor              || atual.valor,
            data_abastecimento:  data_abastecimento || atual.data_abastecimento
        };

        // 3. Envia a atualização
        console.log('Payload enviado para atualizar:', payload);

        const resposta = await fetch('/abastecimento/atualizar', {
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
            mostrarAbastecimentos();
        }

    } catch (error) {
        console.error('Erro ao editar abastecimento:', error);
        exibirFeedback('erro', 'Erro ao tentar atualizar o abastecimento.');
    }
});
