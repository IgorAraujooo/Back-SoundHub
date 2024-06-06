/********************************************************
 * Objetivo: Arquivo para realizar o CRUD de músicas
 * Data: 23/05/2024
 * Autor: Igor Araujo
 * Versão: 1.0
 ********************************************************/

const { PrismaClient } = require('@prisma/client');

// Instanciando o objeto prisma com as características do Prisma Client
const prisma = new PrismaClient();

// Função para listar as músicas existentes
const selectAllMusics = async function() {
    try {
        // Script SQL para listar todos os registros
        let sql = 'SELECT * FROM tbl_musica ORDER BY id_musica DESC';

        // Executa o script no banco de dados e recebe o retorno dos dados
        let rsMusics = await prisma.$queryRawUnsafe(sql);

        // Tratamento de erro para retornar dados ou retornar false
        if (rsMusics.length > 0)
            return rsMusics;
        else
            return false;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Função para buscar uma música pelo ID
const selectByIdMusic = async function(id) {
    try {
        // Realiza a busca da música pelo ID
        let sql = `SELECT * FROM tbl_musica WHERE id_musica = ${id}`;

        // Executa o script no banco de dados
        let rsMusics = await prisma.$queryRawUnsafe(sql);
        return rsMusics;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Função para deletar uma música pelo ID
const deleteMusic = async function(id) {
    try {
        // Realiza a busca da música pelo ID e deleta
        let sql = `DELETE FROM tbl_musica WHERE id_musica = ${id}`;

        // Executa no banco de dados o script SQL
        let rsMusics = await prisma.$queryRawUnsafe(sql);
        return rsMusics;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Função para inserir uma nova música
const insertMusic = async function(dadosMusic) {
    try {
        let sql = `
            INSERT INTO tbl_musica (nome, duracao, foto_capa, id_playlist, id_album, URL) 
            VALUES ('${dadosMusic.nome}', '${dadosMusic.duracao}', '${dadosMusic.foto_capa}', ${dadosMusic.id_playlist}, ${dadosMusic.id_album}, '${dadosMusic.URL}')
        `;

        // Executa o script SQL no banco de dados
        // $executeRawUnsafe deve ser utilizado para INSERT, UPDATE e DELETE, onde o banco não devolve dados
        let result = await prisma.$executeRawUnsafe(sql);

        // Validação para verificar se o insert funcionou no banco de dados
        if (result)
            return true;
        else
            return false;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Função para obter o último ID inserido na tabela de músicas
const selectIdMusic = async function() {
    try {
        let sql = `
            SELECT CAST(last_insert_id() AS DECIMAL) AS id FROM tbl_musica ORDER BY id_musica DESC LIMIT 1
        `;

        let musicId = await prisma.$queryRawUnsafe(sql);
        return musicId;
    } catch (error) {
        console.log(error);
        return false;
    }
};

const updateMusic = async function(dadosMusic) {
    try {
        let sql = `
            UPDATE tbl_musica 
            SET nome = '${dadosMusic.nome}', 
                duracao = '${dadosMusic.duracao}', 
                foto_capa = '${dadosMusic.foto_capa}', 
                id_playlist = ${dadosMusic.id_playlist}, 
                id_album = ${dadosMusic.id_album}, 
                URL = '${dadosMusic.URL}'
            WHERE id_musica = ${dadosMusic.id}
        `;

        let result = await prisma.$executeRawUnsafe(sql);

        if (result)
            return true;
        else
            return false;
    } catch (error) {
        console.log(error);
        return false;
    }
};


module.exports = {
    selectAllMusics,
    selectByIdMusic,
    deleteMusic,
    insertMusic,
    selectIdMusic,
    updateMusic
};
