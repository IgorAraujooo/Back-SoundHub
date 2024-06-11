const message = require('../modulo/config.js');
const albunsDAO = require('../model/DAO/album.js');

// Função para listar os álbuns existentes
const getListarAlbuns = async function() {
    try {
        let listaAlbuns = await albunsDAO.selectAllAlbums();
        let albunsJSON = {};

        if (listaAlbuns && listaAlbuns.length > 0) {
            albunsJSON.albuns = listaAlbuns;
            albunsJSON.quantidade = listaAlbuns.length;
            albunsJSON.status_code = 200;
            return albunsJSON;
        } else {
            return message.ERROR_NOT_FOUND; // 404
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER_DB; // 500
    }
};

// Função para buscar um álbum pelo id
const getBuscarAlbum = async function(id) {
    try {
        if (id == '' || id == undefined || isNaN(id)) {
            return message.ERROR_INVALID_ID;
        } else {
            let dadosAlbum = await albunsDAO.selectByIdAlbum(id);
            let albunsJSON = {};

            if (dadosAlbum) {
                albunsJSON.album = dadosAlbum;
                albunsJSON.status_code = 200;
                return albunsJSON; // 200
            } else {
                return message.ERROR_NOT_FOUND; // 404
            }
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER_DB; // 500
    }
};

// Função para excluir um álbum pelo id
const setExcluirAlbum = async function(id) {
    try {
        if (id == '' || id == undefined || isNaN(id)) {
            return message.ERROR_INVALID_ID;
        } else {
            let albumExistente = await albunsDAO.selectByIdAlbum(id);

            if (albumExistente) {
                let resultadoExclusao = await albunsDAO.deleteAlbum(id);

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

// Função para inserir um novo álbum
const setInserirNovoAlbum = async function(dadosAlbum, contentType) {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            if (
                dadosAlbum.nome == '' || dadosAlbum.nome == undefined || dadosAlbum.nome.length > 255 ||
                dadosAlbum.foto_capa == '' || dadosAlbum.foto_capa == undefined || dadosAlbum.foto_capa.length > 255 ||
                dadosAlbum.data_lancamento == '' || dadosAlbum.data_lancamento == undefined || dadosAlbum.data_lancamento.length > 10 ||
                dadosAlbum.id_genero == '' || dadosAlbum.id_genero == undefined || isNaN(dadosAlbum.id_genero)
            ) {
                return message.ERROR_REQUIRED_FIELDS; // 400
            } else {
                let novoAlbum = await albunsDAO.insertAlbum(dadosAlbum);
                let idSelect = await albunsDAO.selectIdAlbum();
                dadosAlbum.id_album = Number(idSelect[0].id);

                if (novoAlbum) {
                    let resultdadosAlbum = {
                        status: message.SUCCESS_CREATED_ITEM.status,
                        status_code: message.SUCCESS_CREATED_ITEM.status_code,
                        message: message.SUCCESS_CREATED_ITEM.message,
                        album: dadosAlbum
                    };
                    return resultdadosAlbum; // 201
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

// Função para atualizar um álbum
const setAtualizarAlbum = async function(id, novosDadosAlbum, contentType) {
    try {
        if (id == '' || id == undefined || isNaN(id)) {
            return message.ERROR_INVALID_ID;
        } else if (String(contentType).toLowerCase() !== 'application/json') {
            return message.ERROR_CONTENT_TYPE; // 415
        } else {
            let albumExistente = await albunsDAO.selectByIdAlbum(id);

            if (!albumExistente) {
                return message.ERROR_NOT_FOUND; // 404
            }

            const { nome, foto_capa, data_lancamento, id_genero } = novosDadosAlbum;

            // Verifica se os campos obrigatórios estão presentes e dentro dos limites
            if (
                !nome || nome.length > 255 ||
                !foto_capa || foto_capa.length > 255 ||
                !data_lancamento || data_lancamento.length > 10 ||
                !id_genero || isNaN(id_genero)
            ) {
                return message.ERROR_REQUIRED_FIELDS; // 400
            }

            // Atualiza os dados do álbum
            const albumAtualizado = await albunsDAO.updateAlbum(id, novosDadosAlbum);

            if (albumAtualizado) {
                return {
                    status: message.SUCCESS_UPDATED_ITEM.status,
                    status_code: message.SUCCESS_UPDATED_ITEM.status_code,
                    message: message.SUCCESS_UPDATED_ITEM.message,
                    album: {
                        id_album: id,
                        ...novosDadosAlbum
                    }
                };
            } else {
                return message.ERROR_INTERNAL_SERVER_DB; // 500
            }
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER; // 500
    }
};

module.exports = {
    setExcluirAlbum,
    getBuscarAlbum,
    getListarAlbuns,
    setInserirNovoAlbum,
    setAtualizarAlbum
};
