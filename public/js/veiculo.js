mostrarVeiculos();
/*==================================================================================== */
/*POOPUPs */
/*==================================================================================== */

const grid = document.querySelector('.vehicles-grid')

const modal = document.getElementById('modal');

const modalEx = document.getElementById('modalEx');

const erroPlaca = document.getElementById('erroPlaca')

const excluirBtn = document.getElementById('excluirBtn');

document.getElementById('abrirModal').addEventListener('click', () => {
        modal.style.display = 'block';
    });
    
    document.getElementById('fecharModal').addEventListener('click', () => {
        modal.style.display = 'none';
});
//=======================
document.getElementById('abrirModalEx').addEventListener('click', () => {
        modalEx.style.display = 'block';
    });
    
    document.getElementById('fecharModalEx').addEventListener('click', () => {
        modalEx.style.display = 'none';
});
//========================
document.getElementById('abrirModalEx').addEventListener('click', () => {
        modalEx.style.display = 'block';
    });
    
    document.getElementById('fecharModalEx').addEventListener('click', () => {
        modalEx.style.display = 'none';
    });

document.getElementById('fecharErroPlaca').addEventListener('click', () => {
            erroPlaca.style.display = 'none';
    });
document.getElementById('fecharErroPlacaBtn').addEventListener('click', () => {
            erroPlaca.style.display = 'none';
    });

/*==================================================================================== */
/*
excluirBtn.addEventListener('click',async()=>{
    const dados = await fetch('/veiculo/deletar',{
        method: 'POST'
    })
    const msg = await dados.json();

    if(msg){
    const bgPop = document.getElementById('bgPop');
    const msgTitulo = document.getElementById('msgTitulo')
    modalEx.style.display = 'none';
    erroPlaca.style.display = 'block';

    document.getElementById('msgErro').innerHTML = msg.menssagem;

    bgPop.classList.remove('bg-success');
    bgPop.classList.remove('bg-danger');

    if(msg.status === 'sucesso'){

        bgPop.classList.add('bg-success');
        msgTitulo.innerHTML = 'SUCESSO';

    } else if(msg) {

        bgPop.classList.add('bg-danger');
        msgTitulo.innerHTML = 'ERRO';

    }
}
});
*/
async function mostrarVeiculos() {
    const dados = await fetch('/veiculo/listar',{
        method: 'POST'
    });
    
    const veiculos = await dados.json();

    console.log(veiculos);

    veiculos.forEach(veiculo => {
        console.log(veiculo.modelo);

        grid.insertAdjacentHTML("beforeend",`
                    <div class="vehicle-card">
                        <img class="vehicle-img" src="img/bus.gif" alt="CSZ900"
                            onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                        <div class="vehicle-img-placeholder" style="display:none;">🚌</div>
                        <div class="vehicle-body">
                            <div class="vehicle-header">
                                <span class="vehicle-model">${veiculo.modelo}</span>
                                <span class="badge-status badge-operacao">Em operação</span>
                            </div>
                            <div class="vehicle-meta">Marca: <span>${veiculo.marca}</span></div>
                            <div class="vehicle-meta">Placa: <span>${veiculo.placa}</span></div>
                            <div class="vehicle-footer">
                                <div class="vehicle-stat">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                    </svg>
                                    ${veiculo.capacidade_passageiros} passageiros
                                </div>
                                <div class="vehicle-stat">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    125.430 km
                                </div>                             
                            </div>
                        </div>
                    </div>
            
            `)


    });
}



document.getElementById('formExcluir').addEventListener('submit', async (e) => {

    e.preventDefault();

    const placa = document.querySelector('#formExcluir input[name="placa"]').value;

    const resposta = await fetch('/veiculo/deletar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ placa })
    });

    const dados = await resposta.json();

    console.log(dados);

    if(dados){
    const bgPop = document.getElementById('bgPop');
    const msgTitulo = document.getElementById('msgTitulo')
    modalEx.style.display = 'none';
    erroPlaca.style.display = 'block';

    document.getElementById('msgErro').innerHTML = dados.menssagem;

    bgPop.classList.remove('bg-success');
    bgPop.classList.remove('bg-danger');

    if(dados.status === 'sucesso'){

        bgPop.classList.add('bg-success');
        msgTitulo.innerHTML = 'SUCESSO';

    } else if(dados.status === 'erro') {

        bgPop.classList.add('bg-danger');
        msgTitulo.innerHTML = 'ERRO';

    }}
});








/*NEVBAR                                                    ------------------------------------------------*/
/*(function () {
    'use strict';

    const hamburgerBtn  = document.getElementById('hamburgerBtn');
    const closeBtn      = document.getElementById('closeBtn');
    const sidebar       = document.getElementById('barraLateral');
    const overlay       = document.getElementById('sidebarOverlay');

    
    function openSidebar() {
        sidebar.classList.add('is-open');
        overlay.classList.add('is-visible');
        hamburgerBtn.classList.add('is-open');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // impede scroll do fundo
    }

    
    function closeSidebar() {
        sidebar.classList.remove('is-open');
        overlay.classList.remove('is-visible');
        hamburgerBtn.classList.remove('is-open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    // Abre ao clicar no hambúrguer
    hamburgerBtn.addEventListener('click', function () {
        const isOpen = sidebar.classList.contains('is-open');
        isOpen ? closeSidebar() : openSidebar();
    });

    // Fecha ao clicar no botão "×" dentro da sidebar
    closeBtn.addEventListener('click', closeSidebar);

    // Fecha ao clicar no overlay
    overlay.addEventListener('click', closeSidebar);

    // Fecha com a tecla Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
            closeSidebar();
        }
    });

    // Garante reset ao redimensionar para desktop (evita sidebar travada)
    window.addEventListener('resize', function () {
        if (window.innerWidth > 576) {
            closeSidebar();
            document.body.style.overflow = '';
        }
    });

})();*/
/* ------------------------------------------------                                                 NEVBAR*/