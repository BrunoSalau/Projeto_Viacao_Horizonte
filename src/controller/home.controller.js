import { modelCriarUsuario,modelListarUsuarios,buscarUsuarioCPF,modelDeletarUsuario } from '../model/usuarioModel.js';
import { modelCriarMotorista,modelListarMotoristas,buscarMotoristaCPF,modelDeletarMotorista } from '../model/motoristaModel.js';
import { modelCriarSupervisor,modelListarSupervisores,modelBuscarSupervisorCPF, modelDeletarSupervisor } from '../model/supervisorModel.js';



export function mostrar(req,res){
    res.render('index');
}
//MOTORISTA--------------------------------------------
export async function criarMotorista(req,res){
    
    const info = req.body;

    const usuarioCPF = await modelListarUsuarios();

    let cpfRepetido = false;

    usuarioCPF.forEach(usuario => {
        if(info.cpf === usuario.cpf){
            cpfRepetido = true;
        }
    });

    if(cpfRepetido === false){

        if(info.opcao === 'Motorista'){

            if(!info.cnh){
                return res.send("CAMPO CNH NAO ESCRITO")
            }
                //cpf,senha,tipo_usuario
            const usuario = await modelCriarUsuario(info.cpf, info.senha, 'Motorista');
        
                //nome,cpf,cnh,telefone,usuario_id
            const motorista = await modelCriarMotorista(info.nome, info.cpf, info.cnh, info.telefone, usuario.id)
        
            if(usuario && motorista){
                console.log('USUARIO E MOTORISTA CRIADOS!')
                console.log(usuario)
                console.log(motorista)
            }
        
            return res.send(`Usuario: ${usuario.cpf} e Motorista: ${motorista.nome}`)
        }
        if(info.opcao === 'Supervisor'){
                //cpf,senha,tipo_usuario
            const usuario = await modelCriarUsuario(info.cpf, info.senha, 'Supervisor');
        
                //nome,cpf,cnh,telefone,usuario_id
            const supervisor = await modelCriarSupervisor(info.nome, info.cpf, info.telefone, usuario.id)
        
            if(usuario && supervisor){
                console.log('USUARIO E SUPERVISOR CRIADO!')
                console.log(usuario)
                console.log(supervisor)
            }
        
            return res.send(`Usuario: ${usuario.cpf} e Supervisor: ${supervisor.nome}`)
        }


    }
    return res.send("CPF REPETIDO!")

}
export async function listarMotoristas(req,res) {

    const opcao2 = req.body.opcao2;

    const usuarios = await modelListarUsuarios();

    if(opcao2 === 'Motorista'){

        const motoristas = await modelListarMotoristas();

        motoristas.forEach((motorista, index) => {

            const usuario = usuarios.find(user => 
                user.id === motorista.usuario_id
            );

            console.log('==========================');
            console.log(`MOTORISTA ${index + 1}`);
            console.log(usuario);
            console.log(motorista);
        });

    }
    if(opcao2 === 'Supervisor'){

        const supervisores = await modelListarSupervisores();

        supervisores.forEach((supervisor, index) => {

            const usuario = usuarios.find(user => 
                user.id === supervisor.usuario_id
            );

            console.log('==========================');
            console.log(`SUPERVISOR ${index + 1}`);
            console.log(usuario);
            console.log(supervisor);
        });

    }
    if(opcao2 === 'Todos'){

        const motoristas = await modelListarMotoristas();

        const supervisores = await modelListarSupervisores();

        console.log('======= MOTORISTAS =======');

        motoristas.forEach((motorista, index) => {

            const usuario = usuarios.find(user =>
                user.id === motorista.usuario_id
            );

            console.log(`MOTORISTA ${index + 1}`);
            console.log(usuario);
            console.log(motorista);
            console.log('==========================');
        });

        console.log('======= SUPERVISORES =======');

        supervisores.forEach((supervisor, index) => {

            const usuario = usuarios.find(user =>
                user.id === supervisor.usuario_id
            );

            console.log(`SUPERVISOR ${index + 1}`);
            console.log(usuario);
            console.log(supervisor);
            console.log('==========================');
        });
    }

    
    res.redirect('/');

}
//DELETAR--------------------------------
export async function deletarTudo(req,res) {

    const cpf = req.body.cpf;

    const usuarios = await modelListarUsuarios();

    const user = usuarios.find(user => user.cpf === cpf);

    if(!user){return res.send('Usuario não encontrado!')}

    if(user.tipo_usuario === 'Motorista'){
        const deleteMotorista = await modelDeletarMotorista(cpf);
        const deleteUsuario = await modelDeletarUsuario(cpf);

        if(deleteUsuario && deleteMotorista){
        console.log(`Usuario do cpf ${deleteUsuario.cpf}, chamado de ${deleteMotorista.nome} foi deletado!`)
    }
    }
    if(user.tipo_usuario === 'Supervisor'){
        const deleteSupervisor = await modelDeletarSupervisor(cpf);
        const deleteUsuario = await modelDeletarUsuario(cpf);

        if(deleteUsuario && deleteSupervisor){
        console.log(`Usuario do cpf ${deleteUsuario.cpf}, chamado de ${deleteSupervisor.nome} foi deletado!`)
    }
    }



    

    res.send('Usuario Deletado!')
    
}