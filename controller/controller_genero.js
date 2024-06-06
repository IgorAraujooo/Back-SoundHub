const message = require('../modulo/config.js');
const generoDAO = require('../model/DAO/genero.js');

// Função para listar os gêneros musicais existentes
const getListarGeneros = async function() {
    try {
        let listaGeneros = await generoDAO.selectAllGenres();
        let generosJSON = {};

        if (listaGeneros && listaGeneros.length > 0) {
            generosJSON.generos = listaGeneros;
            generosJSON.quantidade = listaGeneros.length;
            generosJSON.status_code = 200;
            return generosJSON;
        } else {
            return message.ERROR_NOT_FOUND; // 404
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER_DB; // 500
    }
};

// Função para buscar um gênero musical pelo id
const getBuscarGenero = async function(id) {
    try {
        if (id == '' || id == undefined || isNaN(id)) {
            return message.ERROR_INVALID_ID;
        } else {
            let dadosGenero = await generoDAO.selectByIdGenre(id);
            let generosJSON = {};

            if (dadosGenero) {
                generosJSON.genero = dadosGenero;
                generosJSON.status_code = 200;
                return generosJSON; // 200
            } else {
                return message.ERROR_NOT_FOUND; // 404
            }
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER_DB; // 500
    }
};

// Função para excluir um gênero musical pelo id
const setExcluirGenero = async function(id) {
    try {
        if (id == '' || id == undefined || isNaN(id)) {
            return message.ERROR_INVALID_ID;
        } else {
            let generoExistente = await generoDAO.selectByIdGenre(id);

            if (generoExistente) {
                let resultadoExclusao = await generoDAO.deleteGenre(id);

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

// Função para inserir um novo gênero musical
const setInserirNovoGenero = async function(dadosGenero, contentType) {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            if (
                dadosGenero.nome == '' || dadosGenero.nome == undefined || dadosGenero.nome.length > 20
            ) {
                return message.ERROR_REQUIRED_FIELDS; // 400
            } else {
                let novoGenero = await generoDAO.insertGenre(dadosGenero);
                let idSelect = await generoDAO.selectIdGenre();
                dadosGenero.id_genero = Number(idSelect[0].id);

                if (novoGenero) {
                    let resultdadosGenero = {
                        status: message.SUCCESS_CREATED_ITEM.status,
                        status_code: message.SUCCESS_CREATED_ITEM.status_code,
                        message: message.SUCCESS_CREATED_ITEM.message,
                        genero: dadosGenero
                    };
                    return resultdadosGenero; // 201
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

// Função para atualizar um gênero pelo ID
const setAtualizarGenero = async function(id, novosDadosGenero) {
    try {
        if (
            id == '' || id == undefined || isNaN(id) ||
            novosDadosGenero.nome == '' || novosDadosGenero.nome == undefined || novosDadosGenero.nome.length > 255
        ) {
            return message.ERROR_INVALID_INPUT; // 400
        } else {
            let generoExistente = await generoDAO.selectByIdGenre(id);

            if (generoExistente) {
                // Atualiza os dados do gênero
                let resultadoAtualizacao = await generoDAO.updateGenre(id, novosDadosGenero);

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
    setExcluirGenero,
    getBuscarGenero,
    getListarGeneros,
    setInserirNovoGenero,
    setAtualizarGenero
};
