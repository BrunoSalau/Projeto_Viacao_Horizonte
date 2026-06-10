import { modelCriarManutencao, modelListarManutencoes, modelDeletarManutencao } from '../model/manutencaoModel.js';

export class controllerManutencao {

    static async criarManutencao(req, res) {
        try {
            const { id_veiculo, descricao, data_manutencao } = req.body;

            const manutencao = await modelCriarManutencao(id_veiculo, descricao, data_manutencao);

            if (!manutencao) {
                return res.json({
                    status: 'erro',
                    mensagem: 'Erro alguma id de manutenção está vazia!'
                });
            }

            console.log(`Manutenção registrada: ${JSON.stringify(manutencao)}`);

            return res.json({
                status: 'sucesso',
                mensagem: 'Manutenção foi Registrada!',
                dados: manutencao
            });

        } catch (error) {
            console.log(error);
            return res.send('Erro interno do servidor');
        }
    }

    static async listarManutencoes(req, res) {
        try {
            const manutencoes = await modelListarManutencoes();

            if (!manutencoes) {
                console.log('Nenhuma manutenção encontrada!');
                return res.send('Nenhuma manutenção encontrada');
            }

            console.log('Listando manutenções...');
            return res.json(manutencoes);

        } catch (error) {
            console.log(error);
            return res.send('Erro interno do servidor');
        }
    }

    static async deletarManutencao(req, res) {
        try {
            const { id } = req.body;

            const manutencao = await modelDeletarManutencao(id);

            if (!manutencao) {
                return res.json({
                    status: 'erro',
                    mensagem: 'Manutenção não encontrada!'
                });
            }

            console.log(`Manutenção de id ${manutencao.id} foi deletada com sucesso!`);

            return res.json({
                status: 'sucesso',
                mensagem: 'Manutenção deletada com sucesso!'
            });

        } catch (error) {
            console.log(error);
            return res.send('Erro interno do servidor');
        }
    }
}