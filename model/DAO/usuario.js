/********************************************************
 * Objetivo: Arquivo para realizar o crud de usuários
 * Data: 23/05/2024
 * Autor: Igor Araujo
 * Versão: 1.0
 ********************************************************/


const { PrismaClient } = require ('@prisma/client')

// Instaciando o objeto prisma com as características do Prisma Client
const prisma = new PrismaClient();

// Função para excluir um usuário pelo ID
const deleteUsuario = async function(id) {
    try {
        // Realiza a exclusão do usuário pelo ID
        let sql = `DELETE FROM tbl_usuarios WHERE id_usuarios = ${id}`;
    
        // Executa o script SQL no banco de dados
        let rsUsuario = await prisma.$queryRawUnsafe(sql);
        return rsUsuario;
    
    } catch (error) {
        return false;
    }
}

// Função para listar todos os usuários presentes na tabela 
const selectAllUsuarios = async function(){
    try {
        // Script SQL para listar todos os registros
        let sql = 'SELECT * FROM tbl_usuarios ORDER BY id_usuarios DESC';

        // Executa o script no banco de dados e recebe o retorno dos dados
        let rsUsuarios = await prisma.$queryRawUnsafe(sql);

        // Tratamento de erro para retornar dados ou retornar false
        if(rsUsuarios.length > 0)
            return rsUsuarios;
        else
            return false;
        
    } catch (error) {
        return false;
    }
}

// Função para buscar um usuário pelo ID
const selectByIdUsuario =  async function(id){    
    try {
        // Realiza a busca do usuário pelo ID
        let sql = `SELECT * FROM tbl_usuarios WHERE id_usuarios = ${id}`;

        // Executa no banco de dados o script SQL
        let rsUsuario = await prisma.$queryRawUnsafe(sql);
        return rsUsuario;

    } catch (error) {
        return false;
    }
} 

// Função para inserir um novo usuário
const insertUsuario = async function(dadosUsuario) {
    try {
        let sql = `
            INSERT INTO tbl_usuarios (nome, email, senha) 
            VALUES (?, ?, ?)
        `;

        // Executa o script SQL no banco de dados com placeholders
        let result = await prisma.$executeRawUnsafe(sql, dadosUsuario.nome, dadosUsuario.email, dadosUsuario.senha);

        // Retorna o ID do usuário inserido
        return result ? result.insertId : false;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Função para atualizar um usuário pelo ID
const setAtualizarUsuario = async function(id, novosDadosUsuario) {
    try {
        if (
            id == '' || id == undefined || isNaN(id) ||
            novosDadosUsuario.nome == '' || novosDadosUsuario.nome == undefined || novosDadosUsuario.nome.length > 255 ||
            novosDadosUsuario.email == '' || novosDadosUsuario.email == undefined || novosDadosUsuario.email.length > 255 ||
            novosDadosUsuario.senha == '' || novosDadosUsuario.senha == undefined || novosDadosUsuario.senha.length > 255
        ) {
            return message.ERROR_INVALID_INPUT; // 400
        } else {
            let usuarioExistente = await usuariosDAO.selectByIdUsuario(id);

            if (usuarioExistente) {
                // Atualiza os dados do usuário
                let resultadoAtualizacao = await usuariosDAO.updateUsuario(id, novosDadosUsuario);

                if (resultadoAtualizacao) {
                    return message.SUCCESS_UPDATED_ITEM; // 200
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB; // 500
                }
            } else {
                return message.ERROR_NOT_FOUND; // 404
            }
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER; // 500
    }
};

// Função para atualizar um usuário pelo ID
const updateUsuario = async function(id, novosDadosUsuario) {
    try {
        let sql = `
            UPDATE tbl_usuarios
            SET nome = ?, email = ?, senha = ?
            WHERE id_usuarios = ?
        `;

        // Executa o script SQL no banco de dados com placeholders
        let result = await prisma.$executeRawUnsafe(sql, novosDadosUsuario.nome, novosDadosUsuario.email, novosDadosUsuario.senha, id);

        // Retorna verdadeiro se a atualização foi bem-sucedida
        return result ? true : false;
    } catch (error) {
        console.log(error);
        return false;
    }
};



module.exports = {
    selectAllUsuarios,
    selectByIdUsuario,
    deleteUsuario,
    insertUsuario,
    updateUsuario
}
