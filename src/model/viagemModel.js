import { pool } from '../config/db.js'

export class modelViagem{

    // CRIAR VIAGEM COM TODOS OS CAMPOS
    static async criarViagem(id_veiculo, id_rota, id_motorista, data_viagem, horario_viagem) {
        const result = await pool.query(
            `INSERT INTO viagem
            (id_veiculo, id_rota, id_motorista, data_viagem, horario_viagem, status)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [id_veiculo, id_rota, id_motorista, data_viagem, horario_viagem, 'Agendada']
        );
    
        return result.rows[0];
    }
    
    // LISTAR TODAS AS VIAGENS COM JOINS
    static async listarViagens() {
        const result = await pool.query(
            `SELECT 
                v.id,
                v.id_veiculo,
                v.id_rota,
                v.id_motorista,
                v.data_viagem,
                v.horario_viagem,
                v.status,
                v.created_at,
                r.origem,
                r.destino,
                r.distancia_km,
                ve.modelo,
                ve.placa,
                ve.status as status_veiculo,
                m.nome as nome_motorista,
                m.cpf as cpf_motorista
            FROM viagem v
            LEFT JOIN rota r ON v.id_rota = r.id
            LEFT JOIN veiculo ve ON v.id_veiculo = ve.id
            LEFT JOIN motorista m ON v.id_motorista = m.id
            ORDER BY v.data_viagem DESC, v.horario_viagem DESC`
        );
    
        return result.rows;
    }

    // BUSCAR VIAGEM POR ID
    static async buscarViagemPorId(id) {
        const result = await pool.query(
            `SELECT 
                v.id,
                v.id_veiculo,
                v.id_rota,
                v.id_motorista,
                v.data_viagem,
                v.horario_viagem,
                v.status,
                v.created_at,
                r.origem,
                r.destino,
                r.distancia_km,
                ve.modelo,
                ve.placa,
                ve.status as status_veiculo,
                m.nome as nome_motorista,
                m.cpf as cpf_motorista
            FROM viagem v
            LEFT JOIN rota r ON v.id_rota = r.id
            LEFT JOIN veiculo ve ON v.id_veiculo = ve.id
            LEFT JOIN motorista m ON v.id_motorista = m.id
            WHERE v.id = $1`,
            [id]
        );
    
        return result.rows[0];
    }

    // ATUALIZAR VIAGEM
    static async atualizarViagem(id, id_rota, id_veiculo, id_motorista, data_viagem, horario_viagem) {
        const result = await pool.query(
            `UPDATE viagem
            SET id_rota = $1,
                id_veiculo = $2,
                id_motorista = $3,
                data_viagem = $4,
                horario_viagem = $5
            WHERE id = $6
            RETURNING *`,
            [id_rota, id_veiculo, id_motorista, data_viagem, horario_viagem, id]
        );
    
        return result.rows[0];
    }

    // ALTERAR STATUS DA VIAGEM
    static async alterarStatusViagem(id, novoStatus) {
        const result = await pool.query(
            `UPDATE viagem
            SET status = $1
            WHERE id = $2
            RETURNING *`,
            [novoStatus, id]
        );
    
        return result.rows[0];
    }
    
    // DELETAR VIAGEM
    static async deletarViagem(id) {
        const result = await pool.query(
            `DELETE FROM viagem
            WHERE id = $1
            RETURNING *`,
            [id]
        );
    
        return result.rows[0];
    }

    // BUSCAR STATUS ATUAL DA VIAGEM
    static async buscarStatusViagem(id) {
        const result = await pool.query(
            `SELECT status FROM viagem WHERE id = $1`,
            [id]
        );
    
        return result.rows[0];
    }
}
