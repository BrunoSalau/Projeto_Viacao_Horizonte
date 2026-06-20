
const grid = document.getElementById('gridAbastecimento');


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
    listarAbastecimentos();
};


async function listarAbastecimentos() {
    const res = await fetch('/listarAbastecimentos', { method: 'POST' });
    const dados = await res.json();

    grid.innerHTML = "";

    dados.forEach(a => {
        grid.innerHTML += `
            <div class="card-manutencao">
                <h5>Veículo ID: ${a.id_veiculo}</h5>
                <p>${a.litros} L - R$ ${a.valor}</p>
                <small>${a.data_abastecimento}</small>
            </div>
        `;
    });
}

listarAbastecimentos();


document.getElementById('formCriar').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const body = Object.fromEntries(form);

    const res = await fetch('/criarAbastecimento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const msg = await res.json();

    modalCriar.style.display = 'none';
    modalMsg.style.display = 'block';

    document.getElementById('msgTitulo').innerText = msg.status;
    document.getElementById('msgTexto').innerText = msg.menssagem;

    listarAbastecimentos();
});

async function deletarAbastecimento(id) {
    if (!confirm('Tem certeza que deseja deletar esse abastecimento?')) return;
 
    const res = await fetch('/deletarAbastecimento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });
 
    const msg = await res.json();
 
    modalMsg.style.display = 'block';
    document.getElementById('msgTitulo').innerText = msg.status;
    document.getElementById('msgTexto').innerText = msg.menssagem;
 
    listarAbastecimentos();
}
async function deletarAbastecimento(id) {
    if (!confirm('Tem certeza que deseja deletar esse abastecimento?')) return;
 
    const res = await fetch('/deletarAbastecimento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });
 
    const msg = await res.json();
 
    modalMsg.style.display = 'block';
    document.getElementById('msgTitulo').innerText = msg.status;
    document.getElementById('msgTexto').innerText = msg.menssagem;
 
    listarAbastecimentos();
}