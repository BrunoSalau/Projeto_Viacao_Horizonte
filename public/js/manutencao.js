mostrarManutencoes();
carregarVeiculos();

const grid           = document.querySelector('.vehicles-grid');
const modal           = document.getElementById('modal');
const modalEx         = document.getElementById('modalEx');
const modalEdit       = document.getElementById('modalEdit');
const erroPlaca       = document.getElementById('erroPlaca');
const excluirBtn      = document.getElementById('excluirBtn');
const selectVeiculo     = document.getElementById('selectVeiculo');
const selectVeiculoEdit = document.getElementById('selectVeiculoEdit');


document.getElementById('btnPesquisar').addEventListener('click', filtrarManutencoes);
document.getElementById('campoPesquisa').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') filtrarManutencoes();
});

function filtrarManutencoes() {
    const termo = document.getElementById('campoPesquisa').value.toLowerCase().trim();
    const cards = grid.querySelectorAll('.vehicle-card');

    cards.forEach(card => {
        const texto = card.innerText.toLowerCase();
        card.style.display = texto.includes(termo) ? '' : 'none';
    });
}



document.getElementById('abrirModal').addEventListener('click', () => {
    modal.style.display = 'block';
});
document.getElementById('fecharModal').addEventListener('click', () => {
    modal.style.display = 'none';
});


document.getElementById('abrirModalEx').addEventListener('click', () => {
    modalEx.style.display = 'block';
});
document.getElementById('fecharModalEx').addEventListener('click', () => {
    modalEx.style.display = 'none';
});


document.getElementById('abrirModalEdit').addEventListener('click', () => {
    modalEdit.style.display = 'block';
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
    if (e.target === modal)     modal.style.display     = 'none';
    if (e.target === modalEx)   modalEx.style.display   = 'none';
    if (e.target === modalEdit) modalEdit.style.display = 'none';
    if (e.target === erroPlaca) erroPlaca.style.display = 'none';
});


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


async function mostrarManutencoes() {
    const dados = await fetch('/manutencao/listar', {
        method: 'POST'
    });

    // 404 significa lista vazia — não é erro real
    if (dados.status === 404) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #888; padding: 40px 0;">Nenhuma manutenção cadastrada.</div>';
        return;
    }

    if (!dados.ok) {
        exibirFeedback('erro', 'Erro ao carregar manutenções.');
        return;
    }

    const manutencoes = await dados.json();

    manutencoes.forEach((manutencao) => {
        const dataFormatada = manutencao.data_manutencao
            ? new Date(manutencao.data_manutencao).toLocaleDateString('pt-BR')
            : '-';

        const veiculoLabel = manutencao.placa
            ? `${manutencao.modelo} - ${manutencao.placa}`
            : `Veículo #${manutencao.id_veiculo}`;

        grid.insertAdjacentHTML('beforeend', `
            <div class="vehicle-card">
                <div class="route-icon-container">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f5c518" stroke-width="2">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                    </svg>
                </div>
                <div class="vehicle-body">
                    <div class="vehicle-header">
                        <span class="vehicle-model">Manutenção #${manutencao.id}</span>
                        <span class="badge-status badge-manutencao">Manutenção</span>
                    </div>
                    <div class="vehicle-meta">Veículo: <span>${veiculoLabel}</span></div>
                    <div class="vehicle-meta">Descrição: <span>${manutencao.descricao}</span></div>
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
                            ID: ${manutencao.id}
                        </div>
                    </div>
                </div>
            </div>
        `);
    });
}



document.getElementById('formAdicionar').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id_veiculo       = document.querySelector('#formAdicionar select[name="id_veiculo"]').value;
    const descricao        = document.querySelector('#formAdicionar input[name="descricao"]').value.trim();
    const data_manutencao  = document.querySelector('#formAdicionar input[name="data_manutencao"]').value;

    try {
        const resposta = await fetch('/manutencao/adicionar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_veiculo, descricao, data_manutencao })
        });

        const dados = await resposta.json();

        modal.style.display = 'none';
        exibirFeedback(dados.status, dados.menssagem);

        if (dados.status === 'sucesso') {
            grid.innerHTML = '';
            mostrarManutencoes();
        }

    } catch (error) {
        console.error('Erro ao cadastrar manutenção:', error);
        exibirFeedback('erro', 'Erro ao tentar cadastrar a manutenção.');
    }
});


document.getElementById('formExcluir').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.querySelector('#formExcluir input[name="id"]').value;

    const resposta = await fetch('/manutencao/deletar', {
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
            mostrarManutencoes();
        }
    }
});


document.getElementById('formEditar').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id               = document.querySelector('#formEditar input[name="id"]').value.trim();
    const id_veiculo       = document.querySelector('#formEditar select[name="id_veiculo"]').value;
    const descricao        = document.querySelector('#formEditar input[name="descricao"]').value.trim();
    const data_manutencao  = document.querySelector('#formEditar input[name="data_manutencao"]').value;

    try {

        const buscaResposta = await fetch('/manutencao/procurar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });

        if (!buscaResposta.ok) {
            exibirFeedback('erro', 'ID não encontrado. Verifique e tente novamente.');
            return;
        }

        const atual = await buscaResposta.json();


        const payload = {
            id,
            id_veiculo:       id_veiculo       || atual.id_veiculo,
            descricao:        descricao        || atual.descricao,
            data_manutencao:  data_manutencao  || atual.data_manutencao
        };


        console.log('Payload enviado para atualizar:', payload);

        const resposta = await fetch('/manutencao/atualizar', {
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
            mostrarManutencoes();
        }

    } catch (error) {
        console.error('Erro ao editar manutenção:', error);
        exibirFeedback('erro', 'Erro ao tentar atualizar a manutenção.');
    }
});
