const cpfInput = document.getElementById('cpf');
const senhaInput = document.getElementById('senha');
const form = document.querySelector('.formulario');
const msgCpf = document.getElementById('msgCpf');
const msgSenha = document.getElementById('msgSenha');
const olho = document.getElementById('mostrarSenha');

let cpfValido = false;
let senhaValido = false;

cpfInput.addEventListener('input',()=>{
    let valor = cpfInput.value.replace(/\D/g, '');

    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    cpfInput.value = valor;

    
    cpfValido = verificacaoCPF(cpfInput.value);

    if(!cpfValido){
        cpfInput.classList.add('border-danger','form-errado');
        msgCpf.innerHTML = 'CPF INVALIDO';
    }
    if(cpfValido){
        cpfInput.classList.remove('border-danger','form-errado');
        msgCpf.innerHTML = '<br>';
    }
    
})

senhaInput.addEventListener('input',()=>{
    if(senhaInput.value.length <= 3){
        senhaInput.classList.add('border-danger','form-errado');
        senhaValido = false;
        msgSenha.innerHTML = 'SENHA INCOMPLETA';
    }
    else{
        senhaInput.classList.remove('border-danger','form-errado');
        senhaValido = true;
        msgSenha.innerHTML = '<br>';
    }
    if(senhaInput.value){
        olho.innerHTML = "<img id='olho' class='img-fluid' src='img/olhof.png' alt=''></img>";
    }else{
        olho.innerHTML = '';
    }
})

function verificacaoCPF(val){
    if(cpfInput.value.length < 13){
        return false
    }
    let valor = val.replace(/\D/g, '');
    const unicos = [...valor]
    const Digito1 = primeiroDigito(unicos);
    const Digito2 = segundoDigito(unicos);
    console.log(`Primeiro digito é: ${Digito1}`);
    console.log(`Segundo digito é: ${Digito2}`);
    console.log(unicos[9])
    if(unicos[9] == Digito1 && unicos[10] == Digito2){
        console.log("CPF VALIDO!!!")
        return true;
    }
    else{
        console.log("CPF INVALIDO!")
        return false;
    }
}



function primeiroDigito(digito){
    let soma = 0;
    for(let i = 0; i < 9; i++){
        soma += digito[i] * (10 - i);
    }
    soma = soma % 11;
    if(soma < 2){
        soma = 0;
    }
    else{
        soma = 11 - soma;
    }
    return soma;
}
function segundoDigito(digito){
    let soma = 0;
    for(let i = 0; i < 10; i++){
        soma += digito[i] * (11 - i);
    }
    soma = soma % 11;
    if(soma < 2){
        soma = 0;
    }
    else{
        soma = 11 - soma;
    }
    return soma;
}

form.addEventListener('submit', async (event)=>{
    if(!cpfValido || !senhaValido){
        event.preventDefault()
        
    }
    if(!cpfInput.value){
        msgCpf.innerHTML = '*'
        cpfInput.classList.add('border-danger','form-errado');
        event.preventDefault();
        
    }
    if(!senhaInput.value){
        senhaInput.classList.add('border-danger','form-errado');
        msgSenha.innerHTML = '*'
        event.preventDefault();
        
    }

    //===============
    if(cpfInput.value && senhaInput.value && cpfValido && senhaValido){
        event.preventDefault();
    
        const resposta = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cpfInput: cpfInput.value,
                senhaInput: senhaInput.value
            })
        });
    
        const dados = await resposta.json();
    
        if(!dados.sucesso){
            alert(dados.mensagem);
            return;
        }
    
        alert('Login realizado');
    
        window.location.href = '/login';
    }

    //===========

})

let aberto = false;
    olho.addEventListener('click',()=>{
            if(!aberto){
                olho.innerHTML = "<img id='olho' class='img-fluid' src='img/olho.png' alt=''></img>";
                aberto = true;
                senhaInput.type = 'text';
            }
            else if(aberto){
                olho.innerHTML = "<img id='olho' class='img-fluid' src='img/olhof.png' alt=''></img>";
                aberto = false;
                senhaInput.type = 'password';
            }   
    })
