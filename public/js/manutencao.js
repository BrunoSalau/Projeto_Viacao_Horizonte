const grid = document.getElementById('gridManutencao');


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
    listarManutencoes();
};


async function listarManutencoes() {
    const res = await fetch('/listarManutencoes', { method: 'POST' });
    const dados = await res.json();

    grid.innerHTML = "";

    dados.forEach(m => {
        grid.innerHTML += `
            <div class="card-manutencao">
                <h5>Veículo ID: ${m.id_veiculo}</h5>
                <p>${m.descricao}</p>
                <small>${m.data_manutencao}</small>
            </div>
        `;
    });
}

listarManutencoes();


document.getElementById('formCriar').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const body = Object.fromEntries(form);

    const res = await fetch('/criarManutencao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const msg = await res.json();

    modalCriar.style.display = 'none';
    modalMsg.style.display = 'block';

    document.getElementById('msgTitulo').innerText = msg.status;
    document.getElementById('msgTexto').innerText = msg.menssagem;

    listarManutencoes();
});
async function deletarManutencao(id) {
    if (!confirm('Tem certeza que deseja deletar essa manutenção?')) return;
 
    const res = await fetch('/deletarManutencao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });
 
    const msg = await res.json();
 
    modalMsg.style.display = 'block';
    document.getElementById('msgTitulo').innerText = msg.status;
    document.getElementById('msgTexto').innerText = msg.menssagem;
 
    listarManutencoes();
}