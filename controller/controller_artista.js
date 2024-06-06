const message = require('../modulo/config.js');
const artistaDAO = require('../model/DAO/artista.js');

// Função para listar as músicas existentes 
const getListarArtista = async function() {
    try {
        let listarArtistas = await artistaDAO.selectAllArtist();
        let artistaJSON = {};

        if (listarArtistas && listarArtistas.length > 0) {
            artistaJSON.artista = listarArtistas;
            artistaJSON.quantidade = listarArtistas.length;
            artistaJSON.status_code = 200;
            return artistaJSON;
        } else {
            return message.ERROR_NOT_FOUND; // 404
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER_DB; // 500
    }
};


// Função para buscar uma música pelo id
const getBuscarArtista = async function(id) {
    try {
        if (id == '' || id == undefined || isNaN(id)) {
            return message.ERROR_INVALID_ID;
        } else {
            let dadosArtista = await artistaDAO.selectByIdArtist(id);
            let artistaJSON = {};

            if (dadosArtista) {
                artistaJSON.artista = dadosArtista;
                artistaJSON.status_code = 200;
                return artistaJSON; // 200
            } else {
                return message.ERROR_NOT_FOUND; // 404
            }
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER_DB; // 500
    }
};


// Função para excluir uma música pelo id
const setExcluirArtista = async function(id) {
    try {
        if (id == '' || id == undefined || isNaN(id)) {
            return message.ERROR_INVALID_ID;
        } else {
            let artistaExistente = await artistaDAO.selectByIdArtist(id);

            if (artistaExistente) {
                let resultadoExclusao = await artistaDAO.deleteArtist(id);

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


// Função para inserir uma nova música
const setInserirNovoArtista = async function(dadosArtista, contentType) {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            if (
                dadosArtista.nome == '' || dadosArtista.nome == undefined || dadosArtista.nome.length > 255 ||
                dadosArtista.nome_artistico == '' || dadosArtista.nome_artistico == undefined || dadosArtista.nome_artistico.length > 255 ||
                dadosArtista.descricao == '' || dadosArtista.descricao == undefined || dadosArtista.descricao.length > 255
            ) {
                return message.ERROR_REQUIRED_FIELDS; // 400
            } else {
                let novoArtista = await artistaDAO.insertArtist(dadosArtista);
                let idSelect = await artistaDAO.selectIdArtist();
                if (idSelect && idSelect.length > 0) {
                    dadosArtista.idartista = Number(idSelect[0].id);
                } else {
                    throw new Error('Falha ao recuperar o novo ID do artista');
                }

                if (novoArtista) {
                    let resultadoArtista = {
                        status: message.SUCCESS_CREATED_ITEM.status,
                        status_code: message.SUCCESS_CREATED_ITEM.status_code,
                        message: message.SUCCESS_CREATED_ITEM.message,
                        artista: dadosArtista
                    };
                    return resultadoArtista; // 201
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

// Função para atualizar um artista pelo ID
const setAtualizarArtista = async function(id, novosDadosArtista) {
    try {
        if (
            id == '' || id == undefined || isNaN(id) ||
            novosDadosArtista.nome == '' || novosDadosArtista.nome == undefined || novosDadosArtista.nome.length > 255 ||
            novosDadosArtista.data_nascimento == '' || novosDadosArtista.data_nascimento == undefined || novosDadosArtista.data_nascimento.length > 10 ||
            novosDadosArtista.foto_artista == '' || novosDadosArtista.foto_artista == undefined || novosDadosArtista.foto_artista.length > 255
        ) {
            return message.ERROR_INVALID_INPUT; // 400
        } else {
            let artistaExistente = await artistaDAO.selectByIdArtist(id);

            if (artistaExistente) {
                // Atualiza os dados do artista
                let resultadoAtualizacao = await artistaDAO.updateArtist(id, novosDadosArtista);

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
    setExcluirArtista,
    getBuscarArtista,
    getListarArtista,
    setInserirNovoArtista,
    setAtualizarArtista
};
