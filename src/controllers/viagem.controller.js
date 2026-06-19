import { modelViagem, modelListarViagens, modelDeletarViagem, modelCriarViagem } from "../model/viagemModel.js";

export class controllerViagem{
    static async criarViagem(req, res){
        try{
            const {id_veiculo, id_rota, data_viagem} = req.body;

            const viagem = await modelCriarViagem(id_veiculo, id_rota, data_viagem);

            if(!viagem) {
                return res.json({
                    status: 'erro',
                    mensagem: 'Erro alguma id de viagem está vazia'
                });
            }

            console.log(`Viagem criada: ${JSON.stringify(viagem)}`);

            return res.json({
                status: 'sucesso',
                mensagem: 'Viagem foi criada!',
                dados: viagem
            });
        }catch(error){
            console.log(error);
            return res.send(`Erro interno no servidor`);
        }
    }

    static async listarViagens(req, res){
        try{
            const viagem = await modelListarViagens();

            if(!viagem){
                console.log('Nenhuma viagem encontrada!');
                return res.send('Nenhuma viagem encontrada!');
            }

            console.log('Listando viagens....');
            return res.json(viagem);
        } catch (error){
            console.log(error);
            return res.send('Erro interno do servidor');
        }
    }

    static async deletarViagem(req, res){
        try{
            const {id} = req.body;

            const viagem = await modelDeletarViagem(id);

            if(!viagem){
                return res.json({
                    status: 'erro',
                    mensagem: 'Viagem não encontrada!'
                });
            }
            console.log(`Viagem da id ${viagem.id} foi deletado com sucesso!`);

            return res.json({
                status: 'sucesso',
                mensagem: 'Viagem deletada com sucesso!'
            });
        } catch (error){
            console.log(error);
            return res.send('Erro interno no servidor');
        }
    }
};