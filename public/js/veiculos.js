const grid = document.getElementById('gridVeiculos');


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
    listarVeiculos();
};


async function listarVeiculos() {
    const res = await fetch('/listarVeiculos', { method: 'POST' });
    const dados = await res.json();

    grid.innerHTML = "";

    dados.forEach(v => {
        grid.innerHTML += `
            <div class="card-manutencao">
                <h5>${v.placa}</h5>
                <p>${v.modelo}</p>
                <small>Ano: ${v.ano}</small>
            </div>
        `;
    });
}

listarVeiculos();


document.getElementById('formCriar').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const body = Object.fromEntries(form);

    const res = await fetch('/criarVeiculo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const msg = await res.json();

    modalCriar.style.display = 'none';
    modalMsg.style.display = 'block';

    document.getElementById('msgTitulo').innerText = msg.status;
    document.getElementById('msgTexto').innerText = msg.menssagem;

    listarVeiculos();
});
async function deletarVeiculo(placa) {
    if (!confirm(`Tem certeza que deseja deletar o veículo ${placa}?`)) return;
 
    const res = await fetch('/deletarVeiculo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placa })
    });
 
    const msg = await res.json();
 
    modalMsg.style.display = 'block';
    document.getElementById('msgTitulo').innerText = msg.status;
    document.getElementById('msgTexto').innerText = msg.menssagem;
 
    listarVeiculos();
}