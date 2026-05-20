import prisma from 'prisma/prismaClient.js'

class UsuarioModel{
    //listar
    static async buscarTodos(){
        const usuarios = await prisma.usuario.findMany();

        return usuarios;
    }

    //buscarPorCPF
    static async buscarPorCPF(cpf){
        const usuario = await prisma.usuario.findUnique({
            where: {
                cpf:cpf
            }
        })

        return usuario;
    }

    //CriarUsuario
    static async criarUsuario(cpf,senha,tipo_usuario){
        const usuario = await prisma.usuario.create({
            data:{
                cpf: cpf,
                senha: senha,
                tipo_usuario: tipo_usuario
            }
        })
        return usuario;
    }
    //DeletarUsuario
    static async deletarUsuario(id){
        await prisma.usuario.delete({
            where:{
                id: id
            }
        })
    }
}
class motoristaModel{
    //listar
    static async buscarTodos(){
        const motoristas = await prisma.motorista.findMany();

        return motoristas;
    }

    //buscarPorCPF
    static async buscarPorCPF(cpf){
        const motorista = await prisma.motorista.findUnique({
            where: {
                cpf:cpf
            }
        })

        return motorista;
    }

    //Criarmotorista
    static async criarmotorista(usuario,nome,cpf,cnh,telefone){
        const motorista = await prisma.motorista.create({
            data:{
                usuario_id : usuario.id,
                nome: nome,
                cpf: cpf,
                cnh: cnh,
                telefone: telefone
            }
        })
        return motorista;
    }


    //Deletarmotorista
    static async deletarmotorista(id){
        await prisma.motorista.delete({
            where:{
                id: id
            }
        })
    }
}