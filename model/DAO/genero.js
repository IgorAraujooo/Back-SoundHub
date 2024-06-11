/********************************************************
 * Objetivo: Arquivo para realizar o CRUD de gêneros
 * Data: 23/05/2024
 * Autor: Igor Araujo
 * Versão: 1.0
 ********************************************************/

const { PrismaClient } = require('@prisma/client');

// Instanciando o objeto prisma com as características do Prisma Client
const prisma = new PrismaClient();

// Função para listar os gêneros existentes
const selectAllGenres = async function() {
    try {
        // Script SQL para listar todos os registros
        let sql = 'select * from tbl_genero order by id_genero desc';

        // Executa o script no banco de dados e recebe o retorno dos dados
        let rsGenres = await prisma.$queryRawUnsafe(sql);

        // Tratamento de erro para retornar dados ou retornar false
        if (rsGenres.length > 0)
            return rsGenres;
        else
            return false;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Função para listar gênero filtrando pelo ID
const selectByIdGenre = async function(id) {
    try {
        // Realiza a busca do gênero pelo ID
        let sql = `select * from tbl_genero where id_genero = ${id}`;

        // Executa o script no banco de dados
        let rsGenres = await prisma.$queryRawUnsafe(sql);
        return rsGenres;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Função para deletar um gênero pelo ID
const deleteGenre = async function(id) {
    try {
        // Realiza a busca do gênero pelo ID e deleta
        let sql = `delete from tbl_genero where id_genero = ${id}`;

        // Executa no banco de dados o script SQL
        let rsGenres = await prisma.$queryRawUnsafe(sql);
        return rsGenres;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Função para inserir um novo gênero
const insertGenre = async function(dadosGenre) {
    try {
        let sql = `
            insert into tbl_genero (nome) 
            values ('${dadosGenre.nome}')
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

// Função para obter o último ID inserido na tabela de gêneros
const selectIdGenre = async function() {
    try {
        let sql = `
            SELECT CAST(last_insert_id() AS DECIMAL) AS id FROM tbl_genero ORDER BY id_genero DESC LIMIT 1
        `;

        let genreId = await prisma.$queryRawUnsafe(sql);
        return genreId;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Função para atualizar um gênero pelo ID
const updateGenre = async function(id, novosDadosGenre) {
    try {
        let sql = `
            UPDATE tbl_genero
            SET nome = ?
            WHERE id_genero = ?
        `;

        // Executa o script SQL no banco de dados com placeholders
        let result = await prisma.$executeRawUnsafe(sql, novosDadosGenre.nome, id);

        // Retorna verdadeiro se a atualização foi bem-sucedida
        return result ? true : false;
    } catch (error) {
        console.log(error);
        return false;
    }
};

module.exports = {
    selectAllGenres,
    selectByIdGenre,
    deleteGenre,
    insertGenre,
    selectIdGenre,
    updateGenre
};
