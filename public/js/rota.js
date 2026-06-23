mostrarRotas();


const grid      = document.querySelector('.vehicles-grid');
const modal     = document.getElementById('modal');
const modalEx   = document.getElementById('modalEx');
const modalEdit = document.getElementById('modalEdit');
const erroPlaca = document.getElementById('erroPlaca');
const excluirBtn = document.getElementById('excluirBtn');


document.getElementById('btnPesquisar').addEventListener('click', filtrarRotas);
document.getElementById('campoPesquisa').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') filtrarRotas();
});

function filtrarRotas() {
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

document.getElementById('btnLogout').addEventListener('click', async () => {
    await fetch('/usuario/logout', { method: 'POST' });
    localStorage.removeItem('token');
    localStorage.removeItem('tipo');
    window.location.href = '/';
});


window.addEventListener('click', (e) => {
    if (e.target === modal)     modal.style.display     = 'none';
    if (e.target === modalEx)   modalEx.style.display   = 'none';
    if (e.target === modalEdit) modalEdit.style.display = 'none';
    if (e.target === erroPlaca) erroPlaca.style.display = 'none';
});

    async function obterDadosUsuario() {
       const resposta = await fetch('/usuario/perfil');
       const retorno = await resposta.json();
       
       console.log(retorno);
       document.querySelector('.user-name').innerHTML = retorno.dados.nome;
       document.querySelector('.user-role').innerHTML = retorno.dados.tipo;
       if(retorno.dados.tipo == "Supervisor"){
           document.querySelector('.user-avatar-placeholder').innerHTML = `
           <img class="img-fluid nav-icon" src="img/icons/supervisorIMG.png" alt="SP">
           `;
       }else{
        document.querySelector('.user-avatar-placeholder').innerHTML = `
        <img class="img-fluid nav-icon" src="img/icons/motoristaIMG.png" alt="MT">
        `;
       }
   }
   obterDadosUsuario();

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

async function mostrarRotas() {
    const dados = await fetch('/rota/listar', {
        method: 'POST'
    });

    if (dados.status === 404) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #888; padding: 40px 0;">Nenhuma rota cadastrada.</div>';
        return;
    }

    if (!dados.ok) {
        exibirFeedback('erro', 'Erro ao carregar rotas.');
        return;
    }

    const rotas = await dados.json();

    rotas.forEach((rota, index) => {
        grid.insertAdjacentHTML('beforeend', `
            <div class="vehicle-card">
                <div class="route-icon-container">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f5c518" stroke-width="2">
                        <circle cx="12" cy="12" r="1"/>
                        <path d="M12 1v6m0 6v6"/>
                        <circle cx="12" cy="6" r="1" fill="#f5c518"/>
                        <circle cx="12" cy="18" r="1" fill="#f5c518"/>
                    </svg>
                </div>
                <div class="vehicle-body">
                    <div class="vehicle-header">
                        <span class="vehicle-model">Rota #${rota.id}</span>
                        <span class="badge-status badge-ativo">Ativa</span>
                    </div>
                    <div class="vehicle-meta">Origem: <span>${rota.origem}</span></div>
                    <div class="vehicle-meta">Destino: <span>${rota.destino}</span></div>
                    <div class="vehicle-footer">
                        <div class="vehicle-stat">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                                <polyline points="13 2 13 9 20 9"/>
                            </svg>
                            ${rota.distancia_km} km
                        </div>
                        <div class="vehicle-stat">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                            </svg>
                            ID: ${rota.id}
                        </div>
                    </div>
                </div>
            </div>
        `);
    });
}

document.getElementById('formAdicionar').addEventListener('submit', async (e) => {
    e.preventDefault();

    const origem         = document.querySelector('#formAdicionar input[name="origem"]').value.trim();
    const destino        = document.querySelector('#formAdicionar input[name="destino"]').value.trim();
    const distancia_km   = document.querySelector('#formAdicionar input[name="distancia_km"]').value.trim();

    try {
        const resposta = await fetch('/rota/adicionar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ origem, destino, distancia_km })
        });

        const dados = await resposta.json();

        modal.style.display = 'none';
        exibirFeedback(dados.status, dados.menssagem);

        if (dados.status === 'sucesso') {
            grid.innerHTML = '';
            mostrarRotas();
        }

    } catch (error) {
        console.error('Erro ao cadastrar rota:', error);
        exibirFeedback('erro', 'Erro ao tentar cadastrar a rota.');
    }
});

document.getElementById('formExcluir').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.querySelector('#formExcluir input[name="id"]').value;

    const resposta = await fetch('/rota/deletar', {
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
            mostrarRotas();
        }
    }
});

document.getElementById('formEditar').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id               = document.querySelector('#formEditar input[name="id"]').value.trim();
    const origem           = document.querySelector('#formEditar input[name="origem"]').value.trim();
    const destino          = document.querySelector('#formEditar input[name="destino"]').value.trim();
    const distancia_km     = document.querySelector('#formEditar input[name="distancia_km"]').value.trim();

    try {
        const buscaResposta = await fetch('/rota/procurar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });

        if (!buscaResposta.ok) {
            if (!origem || !destino) {
                exibirFeedback('erro', 'ID não encontrada. Verifique e tente novamente.');
                return;
            }
        }
        let atual = {};
        if (buscaResposta.ok) {
            atual = await buscaResposta.json();
        }

        const payload = {
            id,
            origem:         origem         || atual.origem,
            destino:        destino        || atual.destino,
            distancia_km:   distancia_km   || atual.distancia_km
        };

        console.log('Payload enviado para atualizar:', payload);

        const resposta = await fetch('/rota/atualizar', {
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
            mostrarRotas();
        }

    } catch (error) {
        console.error('Erro ao editar rota:', error);
        exibirFeedback('erro', 'Erro ao tentar atualizar a rota.');
    }
});
