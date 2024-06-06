/********************************************************
 * Objetivo: Arquivo para realizar o CRUD de músicas
 * Data: 23/05/2024
 * Autor: Igor Araujo
 * Versão: 1.0
 ********************************************************/

const message = require('../modulo/config.js');
const musicaDAO = require('../model/DAO/musicas.js');

// Função para listar as músicas existentes
const getListarMusicas = async function() {
    try {
        let listaMusicas = await musicaDAO.selectAllMusics();
        let musicasJSON = {};

        if (listaMusicas && listaMusicas.length > 0) {
            musicasJSON.musicas = listaMusicas;
            musicasJSON.quantidade = listaMusicas.length;
            musicasJSON.status_code = 200;
            return musicasJSON;
        } else {
            return message.ERROR_NOT_FOUND; // 404
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER_DB; // 500
    }
};

// Função para buscar uma música pelo ID
const getBuscarMusica = async function(id) {
    try {
        if (id == '' || id == undefined || isNaN(id)) {
            return message.ERROR_INVALID_ID;
        } else {
            let dadosMusica = await musicaDAO.selectByIdMusic(id);
            let musicasJSON = {};

            if (dadosMusica) {
                musicasJSON.musica = dadosMusica;
                musicasJSON.status_code = 200;
                return musicasJSON; // 200
            } else {
                return message.ERROR_NOT_FOUND; // 404
            }
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER_DB; // 500
    }
};

// Função para excluir uma música pelo ID
const setExcluirMusica = async function(id) {
    try {
        if (id == '' || id == undefined || isNaN(id)) {
            return message.ERROR_INVALID_ID;
        } else {
            let musicaExistente = await musicaDAO.selectByIdMusic(id);

            if (musicaExistente) {
                let resultadoExclusao = await musicaDAO.deleteMusic(id);

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
const setInserirNovaMusica = async function(dadosMusica, contentType) {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            // Validação dos dados da música
            if (
                dadosMusica.nome == '' || dadosMusica.nome == undefined || dadosMusica.nome.length > 80 ||
                dadosMusica.duracao == '' || dadosMusica.duracao == undefined ||
                dadosMusica.foto_capa == '' || dadosMusica.foto_capa == undefined || dadosMusica.foto_capa.length > 200 ||
                dadosMusica.id_playlist == '' || dadosMusica.id_playlist == undefined || isNaN(dadosMusica.id_playlist) ||
                dadosMusica.id_album == '' || dadosMusica.id_album == undefined || isNaN(dadosMusica.id_album) ||
                dadosMusica.URL == '' || dadosMusica.URL == undefined || dadosMusica.URL.length > 45
            ) {
                return message.ERROR_REQUIRED_FIELDS; // 400
            } else {
                // Inserção da música no banco de dados
                let novaMusica = await musicaDAO.insertMusic(dadosMusica);
                
                // Obtendo o último ID inserido
                let idSelect = await musicaDAO.selectIdMusic();
                dadosMusica.id_musica = Number(idSelect[0].id);

                if (novaMusica) {
                    let resultdadosMusica = {
                        status: message.SUCCESS_CREATED_ITEM.status,
                        status_code: message.SUCCESS_CREATED_ITEM.status_code,
                        message: message.SUCCESS_CREATED_ITEM.message,
                        musica: dadosMusica
                    };
                    return resultdadosMusica; // 201
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

// Função para atualizar uma música pelo ID
const setAtualizarMusica = async function(dadosMusic) {
    try {
        if (
            dadosMusic.nome == '' || dadosMusic.nome == undefined || dadosMusic.nome.length > 255 ||
            dadosMusic.duracao == '' || dadosMusic.duracao == undefined ||
            dadosMusic.foto_capa == '' || dadosMusic.foto_capa == undefined || dadosMusic.foto_capa.length > 255 ||
            dadosMusic.id_playlist == '' || dadosMusic.id_playlist == undefined || isNaN(dadosMusic.id_playlist) ||
            dadosMusic.id_album == '' || dadosMusic.id_album == undefined || isNaN(dadosMusic.id_album) ||
            dadosMusic.URL == '' || dadosMusic.URL == undefined || dadosMusic.URL.length > 255
        ) {
            return message.ERROR_REQUIRED_FIELDS; // 400
        } else {
            let result = await musicDAO.updateMusic(dadosMusic);

            if (result) {
                return {
                    status: message.SUCCESS_UPDATED_ITEM.status,
                    status_code: message.SUCCESS_UPDATED_ITEM.status_code,
                    message: message.SUCCESS_UPDATED_ITEM.message,
                    music: dadosMusic
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
    setExcluirMusica,
    getBuscarMusica,
    getListarMusicas,
    setInserirNovaMusica,
    setAtualizarMusica
};
