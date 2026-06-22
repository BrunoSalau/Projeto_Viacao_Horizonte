import { modelAbastecimento } from '../model/abastecimentoModel.js';

export class controllerAbastecimento {

    static telaAbastecimento(req, res) {
        res.render('abastecimento');
    }

    // CRIAR ABASTECIMENTO
    static async criarAbastecimento(req, res) {
        try {
            const info = req.body;

            await modelAbastecimento.criarAbastecimento(
                info.id_veiculo, info.litros, info.valor, info.data_abastecimento
            );

            console.log(`Abastecimento do veículo ${info.id_veiculo} adicionado com sucesso!`);

            return res.status(201).json({
                status: 'sucesso',
                menssagem: 'Abastecimento adicionado com sucesso!'
            });

        } catch (error) {
            console.error('Erro ao criar abastecimento:', error);
            return res.status(500).json({
                status: 'erro',
                menssagem: 'Erro interno ao criar abastecimento.'
            });
        }
    }

    // PROCURAR ABASTECIMENTO POR ID
    static async procurarAbastecimento(req, res) {
        try {
            const id = req.body.id;
            const abastecimento = await modelAbastecimento.buscarAbastecimentoPorId(id);

            if (!abastecimento) {
                return res.status(404).json({
                    status: 'erro',
                    menssagem: 'Abastecimento não encontrado.'
                });
            }

            console.log('Abastecimento buscado:', JSON.stringify(abastecimento));
            return res.json(abastecimento);

        } catch (error) {
            console.error('Erro ao procurar abastecimento:', error);
            return res.status(500).json({
                status: 'erro',
                menssagem: 'Erro interno ao procurar abastecimento.'
            });
        }
    }

    // LISTAR ABASTECIMENTOS
    static async listarAbastecimentos(req, res) {
        try {
            const abastecimentos = await modelAbastecimento.listarAbastecimentos();

            if (!abastecimentos || abastecimentos.length === 0) {
                return res.status(404).json({
                    status: 'erro',
                    menssagem: 'Nenhum abastecimento encontrado.'
                });
            }

            console.log('Listando abastecimentos...');
            return res.json(abastecimentos);

        } catch (error) {
            console.error('Erro ao listar abastecimentos:', error);
            return res.status(500).json({
                status: 'erro',
                menssagem: 'Erro interno ao listar abastecimentos.'
            });
        }
    }

    // DELETAR ABASTECIMENTO
    static async deletarAbastecimento(req, res) {
        try {
            const id = req.body.id;
            const abastecimento = await modelAbastecimento.deletarAbastecimento(id);

            if (!abastecimento) {
                return res.json({
                    status: 'erro',
                    menssagem: 'ID não identificado!'
                });
            }

            return res.json({
                status: 'sucesso',
                menssagem: 'Abastecimento excluído com sucesso!'
            });

        } catch (error) {
            console.error('Erro ao deletar abastecimento:', error);
            return res.status(500).json({
                status: 'erro',
                menssagem: 'Erro interno ao deletar abastecimento.'
            });
        }
    }

    // ATUALIZAR ABASTECIMENTO
    static async atualizarAbastecimento(req, res) {
        try {
            const { id, id_veiculo, litros, valor, data_abastecimento } = req.body;

            const existe = await modelAbastecimento.buscarAbastecimentoPorId(id);

            if (!existe) {
                return res.status(404).json({
                    status: 'erro',
                    menssagem: 'ID não identificado!'
                });
            }

            const abastecimento = await modelAbastecimento.atualizarAbastecimento(
                id, id_veiculo, litros, valor, data_abastecimento
            );

            return res.json({
                status: 'sucesso',
                menssagem: 'Abastecimento atualizado com sucesso!',
                dados: abastecimento
            });

        } catch (error) {
            console.error('Erro ao atualizar abastecimento:', error);
            return res.status(500).json({
                status: 'erro',
                menssagem: 'Erro interno ao atualizar abastecimento.'
            });
        }
    }
}
