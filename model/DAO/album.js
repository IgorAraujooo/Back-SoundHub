/********************************************************
 * Objetivo: Arquivo para realizar o crud de álbuns
 * Data: 23/05/2024
 * Autor: Igor Araujo
 * Versão: 1.0
 ********************************************************/

const { PrismaClient } = require('@prisma/client');

// Instanciando o objeto prisma com as características do prisma client
const prisma = new PrismaClient();

// Função para listar os álbuns existentes
const selectAllAlbums = async function() {
    try {
        // Script SQL para listar todos os registros
        let sql = 'select * from tbl_album order by id_album desc';

        // Executa o script no banco de dados e recebe o retorno dos dados
        let rsAlbums = await prisma.$queryRawUnsafe(sql);

        // Tratamento de erro para retornar dados ou retornar false
        if (rsAlbums.length > 0)
            return rsAlbums;
        else
            return false;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Função para listar álbum filtrando pelo ID
const selectByIdAlbum = async function(id) {
    try {
        // Realiza a busca do álbum pelo ID
        let sql = `select * from tbl_album where id_album = ${id}`;

        // Executa o script no banco de dados
        let rsAlbums = await prisma.$queryRawUnsafe(sql);
        return rsAlbums;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Função para deletar um álbum pelo ID
const deleteAlbum = async function(id) {
    try {
        // Realiza a busca do álbum pelo ID e deleta
        let sql = `delete from tbl_album where id_album = ${id}`;

        // Executa no banco de dados o script SQL
        let rsAlbums = await prisma.$queryRawUnsafe(sql);
        return rsAlbums;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Função para inserir um novo álbum
const insertAlbum = async function(dadosAlbum) {
    try {
        let sql = `
            insert into tbl_album (nome, foto_capa, data_lancamento, id_genero) 
            values ('${dadosAlbum.nome}', '${dadosAlbum.foto_capa}', '${dadosAlbum.data_lancamento}', ${dadosAlbum.id_genero})
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

// Função para obter o último ID inserido na tabela de álbuns
const selectIdAlbum = async function() {
    try {
        let sql = `
            SELECT CAST(last_insert_id() AS DECIMAL) AS id FROM tbl_album ORDER BY id_album DESC LIMIT 1
        `;

        let albumId = await prisma.$queryRawUnsafe(sql);
        return albumId;
    } catch (error) {
        console.log(error);
        return false;
    }
};

const updateAlbum = async function(id, dadosAlbum) {
    try {
        let sql = `
            update tbl_album 
            set nome = '${dadosAlbum.nome}', 
                foto_capa = '${dadosAlbum.foto_capa}', 
                data_lancamento = '${dadosAlbum.data_lancamento}', 
                id_genero = ${dadosAlbum.id_genero} 
            where id_album = ${id}
        `;

        // Executa o script SQL no banco de dados
        // $executeRawUnsafe deve ser utilizado para INSERT, UPDATE e DELETE, onde o banco não devolve dados
        let result = await prisma.$executeRawUnsafe(sql);

        // Validação para verificar se a atualização foi bem-sucedida no banco de dados
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
    selectAllAlbums,
    selectByIdAlbum,
    deleteAlbum,
    insertAlbum,
    selectIdAlbum,
    updateAlbum
};
