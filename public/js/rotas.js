const grid = document.getElementById('gridRotas');


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
    listarRotas();
};


async function listarRotas() {
    const res = await fetch('/listarRotas', { method: 'POST' });
    const dados = await res.json();

    grid.innerHTML = "";

    dados.forEach(r => {
        grid.innerHTML += `
            <div class="card-manutencao">
                <h5>${r.origem} → ${r.destino}</h5>
                <p>Distância: ${r.distancia_km} km</p>
            </div>
        `;
    });
}

listarRotas();


document.getElementById('formCriar').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const body = Object.fromEntries(form);

    const res = await fetch('/criarRota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const msg = await res.json();

    modalCriar.style.display = 'none';
    modalMsg.style.display = 'block';

    document.getElementById('msgTitulo').innerText = msg.status;
    document.getElementById('msgTexto').innerText = msg.menssagem;

    listarRotas();
});