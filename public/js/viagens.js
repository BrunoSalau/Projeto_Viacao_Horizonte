const grid = document.getElementById('gridViagens');


const modalCriar = document.getElementById('modalCriar');
const modalMsg = document.getElementById('modalMsg');

document.getElementById('btnAbrirCriar').onclick = () => {
    modalCriar.style.display = 'block';
};

document.getElementById('fecharCriar').onclick = () => {
    modalCriar.style.display = 'none';
};

document.getElementById('fecharMsg').onclick = () => {
    modalMsg.style.display = 'none';
};

document.getElementById('btnListar').onclick = () => {
    listarViagens();
};


async function listarViagens() {
    const res = await fetch('/listarViagens', { method: 'POST' });
    const dados = await res.json();

    grid.innerHTML = "";

    dados.forEach(vg => {
        grid.innerHTML += `
            <div class="card-manutencao">
                <h5>Viagem - Veículo ${vg.id_veiculo}</h5>
                <p>Motorista ID: ${vg.id_motorista} | Rota ID: ${vg.id_rota}</p>
                <small>${vg.data_viagem}</small>
            </div>
        `;
    });
}

listarViagens();

document.getElementById('formCriar').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const body = Object.fromEntries(form);

    const res = await fetch('/criarViagem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const msg = await res.json();

    modalCriar.style.display = 'none';
    modalMsg.style.display = 'block';

    document.getElementById('msgTitulo').innerText = msg.status;
    document.getElementById('msgTexto').innerText = msg.menssagem;

    listarViagens();
});
async function deletarViagem(id) {
    if (!confirm('Tem certeza que deseja deletar essa viagem?')) return;
 
    const res = await fetch('/deletarViagem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });
 
    const msg = await res.json();
 
    modalMsg.style.display = 'block';
    document.getElementById('msgTitulo').innerText = msg.status;
    document.getElementById('msgTexto').innerText = msg.menssagem;
 
    listarViagens();
}