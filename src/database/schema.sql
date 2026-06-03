--DROP TABLE supervisor;
--DROP TABLE motorista;
--DROP TABLE usuario;
--DROP TABLE veiculo;

CREATE TABLE IF NOT EXISTS usuario(
    id SERIAL PRIMARY KEY,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    senha VARCHAR(250) NOT NULL,
    tipo_usuario VARCHAR(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS motorista(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(250) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    cnh VARCHAR(250) NOT NULL,
    telefone VARCHAR(10) NOT NULL,
    usuario_id INTEGER NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS supervisor(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(250) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    telefone VARCHAR(10) NOT NULL,
    usuario_id INTEGER NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS veiculo(
    id SERIAL PRIMARY KEY,
    placa VARCHAR(10) UNIQUE NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    ano INTEGER NOT NULL,
    capacidade_passageiros INTEGER,
    status VARCHAR(20) DEFAULT 'Disponivel'
);


