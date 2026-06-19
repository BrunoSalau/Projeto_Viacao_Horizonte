const grid = document.getElementById('gridMotoristas');


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
    listarMotoristas();
};


async function listarMotoristas() {
    const res = await fetch('/listarMotoristas', { method: 'POST' });
    const dados = await res.json();

    grid.innerHTML = "";

    dados.forEach(m => {
        grid.innerHTML += `
            <div class="card-manutencao">
                <h5>${m.nome}</h5>
                <p>CNH: ${m.cnh}</p>
                <small>Telefone: ${m.telefone}</small>
            </div>
        `;
    });
}

listarMotoristas();


document.getElementById('formCriar').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const body = Object.fromEntries(form);

    const res = await fetch('/criarMotorista', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const msg = await res.json();

    modalCriar.style.display = 'none';
    modalMsg.style.display = 'block';

    document.getElementById('msgTitulo').innerText = msg.status;
    document.getElementById('msgTexto').innerText = msg.menssagem;

    listarMotoristas();
});