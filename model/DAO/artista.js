/********************************************************
 * Objetivo: Arquivo para realizar o crud de artistas
 * Data: 23/05/2024
 * Autor: Igor Araujo
 * Versão: 1.0
 ********************************************************/


const { PrismaClient } = require ('@prisma/client')

// Instaciando o o bjeto prisma com as caracteristicas do prisma client
const prisma = new PrismaClient();

// Função para listar os filmes existentes 
const deleteArtist = async function(id) {

    try {
        // Realiza a busca do filme pelo ID
        let sql = `DELETE FROM tbl_artista WHERE id_artista = ${id}`
    
        // Executa no banco de dados o script sql
        let rsArtista = await prisma.$queryRawUnsafe(sql);
            return rsArtista;
    
        } catch (error) {
            return false
            
        }

}

// Listar todos os filmes presentes na tabela 
const selectAllArtist = async function(){

    // Script sql para listar todos os registros
    let sql = 'select * from tbl_artista order by id_artista desc';

    // $queryRawUnsafe(sql)  = Encaminha apenas a variável
    // $queryRaw('select * from tbl_filme) = Encaminha o script do banco 

    // Executa o script no banco de dados e recebe o retorno dos dados da variavel rsServicoss
    let rsArtista = await prisma.$queryRawUnsafe(sql)
     // Para usar await a função necessita ser async(async function)

    // Tratamento de erro para retornar dados ou retornar false
     if(rsArtista.length > 0)
     return rsArtista;
     else
        return false
}

// Listar filme filtrando pelo ID
const selectByIdArtist =  async function(id){    
    try {
    // Realiza a busca do filme pelo ID
    let sql = `select * from tbl_artista where id_artista = ${id}`

    // Executa no banco de dados o script sql
    let rsArtista = await prisma.$queryRawUnsafe(sql);
        return rsArtista;

    } catch (error) {
        return false;
        
    }
} 

const selectIdArtist = async function(id) {
    try {
        let sql = `
            SELECT CAST(last_insert_id() AS DECIMAL) AS id FROM tbl_artista ORDER BY id_artista DESC LIMIT 1
        `;

        let artistaId = await prisma.$queryRawUnsafe(sql);
        return artistaId;
    } catch (error) {
        console.log(error);
        return false;
    }
};



const insertArtist = async function(dadosServicos) {
    try {
        let sql = `
            insert into tbl_artista (nome, data_nascimento, foto_artista) 
            values (?, ?, ?)
        `;

        // Executa o script SQL no banco de dados com placeholders
        let result = await prisma.$executeRawUnsafe(sql, dadosServicos.nome, dadosServicos.nome_artistico, dadosServicos.descricao);

        // Validação para verificar se o insert funcionou no banco de dados
        return result ? true : false;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Função para atualizar um artista pelo ID
const updateArtist = async function(id, novosDadosArtista) {
    try {
        let sql = `
            UPDATE tbl_artista
            SET nome = ?, data_nascimento = ?, foto_artista = ?
            WHERE id_artista = ?
        `;

        // Executa o script SQL no banco de dados com placeholders
        let result = await prisma.$executeRawUnsafe(sql, novosDadosArtista.nome, novosDadosArtista.data_nascimento, novosDadosArtista.foto_artista, id);

        // Retorna verdadeiro se a atualização foi bem-sucedida
        return result ? true : false;
    } catch (error) {
        console.log(error);
        return false;
    }
};



module.exports = {
    selectAllArtist,
    selectByIdArtist,
    deleteArtist,
    selectIdArtist,
    insertArtist,
    updateArtist
}