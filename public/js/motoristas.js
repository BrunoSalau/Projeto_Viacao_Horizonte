
mostrarMotoristas();


const grid      = document.getElementById('gridMotoristas');
const modal     = document.getElementById('modal');
const modalEx   = document.getElementById('modalEx');
const modalEdit = document.getElementById('modalEdit');
const erroPlaca = document.getElementById('erroPlaca');




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
    const msgErro   = document.getElementById('msgErro');

    msgErro.innerHTML = mensagem;

    bgPop.classList.remove('bg-success', 'bg-danger');

    if (status === true || status === 'sucesso') {
        bgPop.classList.add('bg-success');
        msgTitulo.innerHTML = 'SUCESSO';
    } else {
        bgPop.classList.add('bg-danger');
        msgTitulo.innerHTML = 'ERRO';
    }

    erroPlaca.style.display = 'block';
}


function obterIniciais(nome) {
    if (!nome) return '?';
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0][0].toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}


function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11) return false;

    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf[i]) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf[i]) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[10])) return false;

    return true;
}


async function mostrarMotoristas() {
    try {
        const resposta = await fetch('/motorista/listarMotoristas', {
            method: 'GET'
        });

        if (resposta.status === 404) {
            grid.insertAdjacentHTML('beforeend', `
                <div style="grid-column: 1/-1; text-align: center; color: #888; padding: 40px 0;">
                    Nenhum motorista cadastrado.
                </div>
            `);
            return;
        }

        const dados = await resposta.json();

        if (!resposta.ok) {
            exibirFeedback(false, dados.mensagem || 'Erro ao carregar motoristas.');
            return;
        }

        if (!dados.dados || dados.dados.length === 0) {
            grid.insertAdjacentHTML('beforeend', `
                <div style="grid-column: 1/-1; text-align: center; color: #888; padding: 40px 0;">
                    Nenhum motorista cadastrado.
                </div>
            `);
            return;
        }

        dados.dados.forEach(item => {
            const m = item.motorista;
            const iniciais = obterIniciais(m.nome);

            grid.insertAdjacentHTML('beforeend', `
                <div class="vehicle-card">
                    <div class="driver-avatar">
                        <div class="driver-avatar-initials">${iniciais}</div>
                    </div>
                    <div class="vehicle-body">
                        <div class="vehicle-header">
                            <span class="vehicle-model">${m.nome}</span>
                            <span class="badge-status badge-ativo">Ativo</span>
                        </div>
                        <div class="vehicle-meta">CPF: <span>${m.cpf}</span></div>
                        <div class="vehicle-meta">CNH: <span>${m.cnh}</span></div>
                        <div class="vehicle-footer">
                            <div class="vehicle-stat">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                                </svg>
                                ${m.telefone}
                            </div>
                            <button class="btn-more" title="Mais opções">•••</button>
                        </div>
                    </div>
                </div>
            `);
        });

    } catch (error) {
        console.error('Erro ao carregar motoristas:', error);
        exibirFeedback(false, 'Erro ao carregar a lista de motoristas.');
    }
}


document.getElementById('formAdicionar').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome     = document.querySelector('#formAdicionar input[name="nome"]').value.trim();
    const cpf      = document.querySelector('#formAdicionar input[name="cpf"]').value.trim();
    const senha    = document.querySelector('#formAdicionar input[name="senha"]').value.trim();
    const cnh      = document.querySelector('#formAdicionar input[name="cnh"]').value.trim();
    const telefone = document.querySelector('#formAdicionar input[name="telefone"]').value.trim();

    if (!validarCPF(cpf)) {
        exibirFeedback(false, 'CPF inválido. Verifique os números digitados.');
        return;
    }

    if (senha.length < 5) {
        exibirFeedback(false, 'A senha deve ter no mínimo 5 caracteres.');
        return;
    }

    try {
        const cpfLimpo = cpf.replace(/\D/g, '');

        const resposta = await fetch('/usuario/criarUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ nome, cpf: cpfLimpo, senha, cnh, telefone, opcao: 'Motorista' })
        });

        const dados = await resposta.json();

        modal.style.display = 'none';
        exibirFeedback(dados.sucesso, dados.mensagem);

        if (dados.sucesso) {
            grid.innerHTML = '';
            mostrarMotoristas();
        }

    } catch (error) {
        console.error('Erro ao cadastrar motorista:', error);
        exibirFeedback(false, 'Erro ao tentar cadastrar o motorista.');
    }
});


document.getElementById('formExcluir').addEventListener('submit', async (e) => {
    e.preventDefault();

    const cpf = document.querySelector('#formExcluir input[name="cpf"]').value.trim();

    try {
        const verificacao = await fetch('/motorista/buscarMotorista', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cpf })
        });

        if (!verificacao.ok) {
            modalEx.style.display = 'none';
            exibirFeedback(false, 'CPF não encontrado na lista de motoristas. Nenhum dado foi removido.');
            return;
        }

        const resposta = await fetch('/usuario/deletarUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ cpf })
        });

        const dados = await resposta.json();

        modalEx.style.display = 'none';
        exibirFeedback(dados.sucesso, dados.mensagem);

        if (dados.sucesso) {
            grid.innerHTML = '';
            mostrarMotoristas();
        }

    } catch (error) {
        console.error('Erro ao excluir motorista:', error);
        exibirFeedback(false, 'Erro ao tentar excluir o motorista.');
    }
});


document.getElementById('formEditar').addEventListener('submit', async (e) => {
    e.preventDefault();

    const cpf      = document.querySelector('#formEditar input[name="cpf"]').value.trim();
    const nome     = document.querySelector('#formEditar input[name="nome"]').value.trim();
    const cnh      = document.querySelector('#formEditar input[name="cnh"]').value.trim();
    const telefone = document.querySelector('#formEditar input[name="telefone"]').value.trim();

    try {

        const verificacao = await fetch('/motorista/buscarMotorista', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cpf })
        });

        if (!verificacao.ok) {
            modalEx.style.display = 'none';
            exibirFeedback(false, 'CPF não encontrado na lista de motoristas. Nenhum dado foi removido.');
            return;
        }


        const resposta = await fetch('/motorista/atualizarMotorista', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cpf, nome, cnh, telefone })
        });

        const dados = await resposta.json();

        modalEdit.style.display = 'none';
        exibirFeedback(dados.sucesso, dados.mensagem);

        if (dados.sucesso) {
            grid.innerHTML = '';
            mostrarMotoristas();
        }

    } catch (error) {
        console.error('Erro ao editar motorista:', error);
        exibirFeedback(false, 'Erro ao tentar atualizar o motorista.');
    }
});


document.getElementById('btnPesquisar').addEventListener('click', filtrarMotoristas);
document.getElementById('campoPesquisa').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') filtrarMotoristas();
});

function filtrarMotoristas() {
    const termo = document.getElementById('campoPesquisa').value.toLowerCase().trim();
    const cards = grid.querySelectorAll('.vehicle-card');

    cards.forEach(card => {
        const texto = card.innerText.toLowerCase();
        card.style.display = texto.includes(termo) ? '' : 'none';
    });
}