import { modelCriarAbastecimento, modelListarAbastecimentos, modelDeletarAbastecimento } from '../model/abastecimentoModel.js';

export class controllerAbastecimento {

    static async criarAbastecimento(req, res) {
        try {
            const { id_veiculo, litros, valor, data_abastecimento } = req.body;

            const abastecimento = await modelCriarAbastecimento(id_veiculo, litros, valor, data_abastecimento);

            if (!abastecimento) {
                return res.json({
                    status: 'erro',
                    mensagem: 'Erro alguma id de abastecimento está vazia!'
                });
            }

            console.log(`Abastecimento registrado: ${JSON.stringify(abastecimento)}`);

            return res.json({
                status: 'sucesso',
                mensagem: 'Abastecimento do veiculo registrado com sucesso!',
                dados: abastecimento
            });

        } catch (error) {
            console.log(error);

            return res.json({
                status: 'erro',
                mensagem: 'Erro interno do servidor!'
            });
        }
    }

    static async listarAbastecimentos(req, res) {
        try {
            const abastecimentos = await modelListarAbastecimentos();

            if (!abastecimentos) {
                console.log('Nenhum abastecimento encontrado!');
                return res.send('Nenhum abastecimento encontrado');
            }

            console.log('Listando abastecimentos...');
            return res.json(abastecimentos);

        } catch (error) {
            console.log(error);

            return res.json({
                status: 'erro',
                mensagem: 'Erro interno do servidor!'
            });
        }
    }

    static async deletarAbastecimento(req, res) {
        try {
            const { id } = req.body;

            const abastecimento = await modelDeletarAbastecimento(id);

            if (!abastecimento) {
                return res.json({
                    status: 'erro',
                    mensagem: 'Abastecimento não encontrado!'
                });
            }

            console.log(`Abastecimento de id ${abastecimento.id} deletado com sucesso!`);

            return res.json({
                status: 'sucesso',
                mensagem: 'Abastecimento deletado com sucesso!'
            });

        } catch (error) {
            console.log(error);

            return res.json({
                status: 'erro',
                mensagem: 'Erro interno do servidor!'
            });
        }
    }
}