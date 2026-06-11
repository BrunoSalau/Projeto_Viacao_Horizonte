import { modelRota } from "../model/rotaModel.js";

export class controllerRota {
    static async criarRota(req, res) {

        try {
            const { OriEstado, OriCidade, DesEstado, DesCidade, distancia_km } = req.body;

            const origem = `${OriCidade} - ${OriEstado}`

            const destino = `${DesCidade} - ${DesEstado}`

            const novaRota = await modelRota.criarRota(origem, destino, distancia_km);

            if (novaRota) {
                return res.status(201).json({
                    rota: novaRota,
                    mensagem: "Rota Criada com Sucesso!"
                });
            }
            else {
                return res.status(400).json({ mensagem: "Erro ao criar a Rota" });
            }

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                mensagem: "Houve algum erro ao criar a rota.",
                erro: error.message
            });
        }
    }

    static async listarRotas(req, res) {
        try {
            const rotas = await modelRota.listarRotas();
            return res.status(200).json(rotas);
        } catch (error) {
            return res.status(500).json({ mensagem: "Ouve algum erro ao listar as rotas." })
        }
    }

    static async atualizarRota(req, res) {

        try {
            const { id, OriEstado, OriCidade, DesEstado, DesCidade, distancia_km } = req.body;

            const origem = OriCidade + " - " + OriEstado;

            const destino = DesCidade + " - " + DesEstado;

            const rotaAtualizada = await modelRota.atualizarRota(
                id,
                origem,
                destino,
                distancia_km
            );

            if (rotaAtualizada) {
                return res.status(200).json({
                    rota: rotaAtualizada,
                    mensagem: "Rota atualizada com sucesso!"
                });
            }

            return res.status(404).json({
                mensagem: "Rota não encontrada."
            });

        } catch (error) {

            return res.status(500).json({
                mensagem: "Houve algum erro ao atualizar a rota."
            });

        }
    }

    static async buscarRota(req,res){
        try {
            const {origem, destino} = req.body;
    
            const rota = await modelRota.buscarRota(origem, destino)
    
            if(rota){
                return res.status(200).json({
                    mensagem: "Rota encontrada!",
                    rota: rota
                });
            }
            else{
                return res.status(404).json({
                    mensagem: "Rota não encontrada"
                });
            }
        }catch(error){
            return res.status(500).json({
                mensagem: "Erro ao procurar a Rota"
            });
        }
    }

    static async deletarRota(req,res){
    try {

        const {id} = req.body;

        const rotaDeletada = await modelRota.deletarRota(id);

        if(rotaDeletada){
            return res.status(200).json({
                mensagem: "Rota deletada com sucesso!",
                rota: rotaDeletada
            });
        }

        return res.status(404).json({
            mensagem: "Rota não encontrada."
        });

    }catch(error){

        return res.status(500).json({
            mensagem: "Erro ao deletar a rota."
        });

    }
}
}