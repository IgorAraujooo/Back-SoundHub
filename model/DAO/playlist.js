/********************************************************
 * Objetivo: Arquivo para realizar o CRUD de playlists
 * Data: 23/05/2024
 * Autor: Igor Araujo
 * Versão: 1.0
 ********************************************************/

const { PrismaClient } = require('@prisma/client');

// Instanciando o objeto prisma com as características do Prisma Client
const prisma = new PrismaClient();

// Função para listar as playlists existentes
const selectAllPlaylists = async function() {
    try {
        // Script SQL para listar todos os registros
        let sql = 'select * from tbl_playlist order by id_playlist desc';

        // Executa o script no banco de dados e recebe o retorno dos dados
        let rsPlaylists = await prisma.$queryRawUnsafe(sql);

        // Tratamento de erro para retornar dados ou retornar false
        if (rsPlaylists.length > 0)
            return rsPlaylists;
        else
            return false;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Função para listar playlist filtrando pelo ID
const selectByIdPlaylist = async function(id) {
    try {
        // Realiza a busca da playlist pelo ID
        let sql = `select * from tbl_playlist where id_playlist = ${id}`;

        // Executa o script no banco de dados
        let rsPlaylists = await prisma.$queryRawUnsafe(sql);
        return rsPlaylists;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Função para deletar uma playlist pelo ID
const deletePlaylist = async function(id) {
    try {
        // Realiza a busca da playlist pelo ID e deleta
        let sql = `delete from tbl_playlist where id_playlist = ${id}`;

        // Executa no banco de dados o script SQL
        let rsPlaylists = await prisma.$queryRawUnsafe(sql);
        return rsPlaylists;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Função para inserir uma nova playlist
const insertPlaylist = async function(dadosPlaylist) {
    try {
        let sql = `
            insert into tbl_playlist (nome) 
            values ('${dadosPlaylist.nome}')
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

// Função para obter o último ID inserido na tabela de playlists
const selectIdPlaylist = async function() {
    try {
        let sql = `
            SELECT CAST(last_insert_id() AS DECIMAL) AS id FROM tbl_playlist ORDER BY id_playlist DESC LIMIT 1
        `;

        let playlistId = await prisma.$queryRawUnsafe(sql);
        return playlistId;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Função para atualizar uma playlist pelo ID
const updatePlaylist = async function(id, novosDadosPlaylist) {
    try {
        let sql = `
            UPDATE tbl_playlist
            SET nome = ?
            WHERE id_playlist = ?
        `;

        // Executa o script SQL no banco de dados com placeholders
        let result = await prisma.$executeRawUnsafe(sql, novosDadosPlaylist.nome, id);

        // Retorna verdadeiro se a atualização foi bem-sucedida
        return result ? true : false;
    } catch (error) {
        console.log(error);
        return false;
    }
};

module.exports = {
    selectAllPlaylists,
    selectByIdPlaylist,
    deletePlaylist,
    insertPlaylist,
    selectIdPlaylist,
    updatePlaylist
};
