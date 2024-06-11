/********************************************************
 * Objetivo: Arquivo para realizar o CRUD de usuários
 * Data: 23/05/2024
 * Autor: Igor Araujo
 * Versão: 1.0
 ********************************************************/

const message = require('../modulo/config.js');
const usuarioDAO = require('../model/DAO/usuario.js');

// Função para listar os usuários existentes 
const getListarUsuarios = async function() {
    try {
        let listarUsuarios = await usuarioDAO.selectAllUsuarios();
        let usuarioJSON = {};

        if (listarUsuarios && listarUsuarios.length > 0) {
            usuarioJSON.usuario = listarUsuarios;
            usuarioJSON.quantidade = listarUsuarios.length;
            usuarioJSON.status_code = 200;
            return usuarioJSON;
        } else {
            return message.ERROR_NOT_FOUND; // 404
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER_DB; // 500
    }
};

// Função para buscar um usuário pelo id
const getBuscarUsuario = async function(id) {
    try {
        if (id == '' || id == undefined || isNaN(id)) {
            return message.ERROR_INVALID_ID;
        } else {
            let dadosUsuario = await usuarioDAO.selectByIdUsuario(id);
            let usuarioJSON = {};

            if (dadosUsuario) {
                usuarioJSON.usuario = dadosUsuario;
                usuarioJSON.status_code = 200;
                return usuarioJSON; // 200
            } else {
                return message.ERROR_NOT_FOUND; // 404
            }
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER_DB; // 500
    }
};

// Função para excluir um usuário pelo id
const setExcluirUsuario = async function(id) {
    try {
        if (id == '' || id == undefined || isNaN(id)) {
            return message.ERROR_INVALID_ID;
        } else {
            let usuarioExistente = await usuarioDAO.selectByIdUsuario(id);

            if (usuarioExistente) {
                let resultadoExclusao = await usuarioDAO.deleteUsuario(id);

                if (resultadoExclusao) {
                    return message.SUCCESS_DELETED_ITEM; // 200
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

const setInserirNovoUsuario = async function(dadosUsuario, contentType) {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            if (
                dadosUsuario.nome == '' || dadosUsuario.nome == undefined || dadosUsuario.nome.length > 100 ||
                dadosUsuario.email == '' || dadosUsuario.email == undefined || dadosUsuario.email.length > 100 ||
                dadosUsuario.senha == '' || dadosUsuario.senha == undefined || dadosUsuario.senha.length > 10
            ) {
                return message.ERROR_REQUIRED_FIELDS; // 400
            } else {
                let novoUsuario = await usuarioDAO.insertUsuario(dadosUsuario);
                let idSelect = await usuarioDAO.selectByIdUsuario();
                if (idSelect && idSelect.length > 0) {
                    dadosUsuario.id_usuarios = Number(idSelect[0].id_usuarios);
                } else {
                    throw new Error('Falha ao recuperar o novo ID do usuário');
                }

                if (novoUsuario) {
                    let resultadoUsuario = {
                        status: message.SUCCESS_CREATED_ITEM.status,
                        status_code: message.SUCCESS_CREATED_ITEM.status_code,
                        message: message.SUCCESS_CREATED_ITEM.message,
                        usuario: dadosUsuario
                    };
                    return resultadoUsuario; // 201
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB; // 500
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE; // 415
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER; // 500
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
            let usuarioExistente = await usuarioDAO.selectByIdUsuario(id);

            if (usuarioExistente) {
                // Atualiza os dados do usuário
                let resultadoAtualizacao = await usuarioDAO.updateUsuario(id, novosDadosUsuario);

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


module.exports = {
    setExcluirUsuario,
    getBuscarUsuario,
    getListarUsuarios,
    setInserirNovoUsuario,
    setAtualizarUsuario
};
