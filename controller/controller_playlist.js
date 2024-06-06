const message = require('../modulo/config.js');
const playlistDAO = require('../model/DAO/playlist.js');

// Função para listar as playlists existentes
const getListarPlaylists = async function() {
    try {
        let listaPlaylists = await playlistDAO.selectAllPlaylists();
        let playlistsJSON = {};

        if (listaPlaylists && listaPlaylists.length > 0) {
            playlistsJSON.playlists = listaPlaylists;
            playlistsJSON.quantidade = listaPlaylists.length;
            playlistsJSON.status_code = 200;
            return playlistsJSON;
        } else {
            return message.ERROR_NOT_FOUND; // 404
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER_DB; // 500
    }
};

// Função para buscar uma playlist pelo id
const getBuscarPlaylist = async function(id) {
    try {
        if (id == '' || id == undefined || isNaN(id)) {
            return message.ERROR_INVALID_ID;
        } else {
            let dadosPlaylist = await playlistDAO.selectByIdPlaylist(id);
            let playlistsJSON = {};

            if (dadosPlaylist) {
                playlistsJSON.playlist = dadosPlaylist;
                playlistsJSON.status_code = 200;
                return playlistsJSON; // 200
            } else {
                return message.ERROR_NOT_FOUND; // 404
            }
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER_DB; // 500
    }
};

// Função para excluir uma playlist pelo id
const setExcluirPlaylist = async function(id) {
    try {
        if (id == '' || id == undefined || isNaN(id)) {
            return message.ERROR_INVALID_ID;
        } else {
            let playlistExistente = await playlistDAO.selectByIdPlaylist(id);

            if (playlistExistente) {
                let resultadoExclusao = await playlistDAO.deletePlaylist(id);

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

// Função para inserir uma nova playlist
const setInserirNovaPlaylist = async function(dadosPlaylist, contentType) {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            if (
                dadosPlaylist.nome == '' || dadosPlaylist.nome == undefined || dadosPlaylist.nome.length > 50
            ) {
                return message.ERROR_REQUIRED_FIELDS; // 400
            } else {
                let novaPlaylist = await playlistDAO.insertPlaylist(dadosPlaylist);
                let idSelect = await playlistDAO.selectIdPlaylist();
                dadosPlaylist.id_playlist = Number(idSelect[0].id);

                if (novaPlaylist) {
                    let resultdadosPlaylist = {
                        status: message.SUCCESS_CREATED_ITEM.status,
                        status_code: message.SUCCESS_CREATED_ITEM.status_code,
                        message: message.SUCCESS_CREATED_ITEM.message,
                        playlist: dadosPlaylist
                    };
                    return resultdadosPlaylist; // 201
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

// Função para atualizar uma playlist pelo ID
const setAtualizarPlaylist = async function(id, novosDadosPlaylist) {
    try {
        if (
            id == '' || id == undefined || isNaN(id) ||
            novosDadosPlaylist.nome == '' || novosDadosPlaylist.nome == undefined || novosDadosPlaylist.nome.length > 255
        ) {
            return message.ERROR_INVALID_INPUT; // 400
        } else {
            let playlistExistente = await playlistDAO.selectByIdPlaylist(id);

            if (playlistExistente) {
                // Atualiza os dados da playlist
                let resultadoAtualizacao = await playlistDAO.updatePlaylist(id, novosDadosPlaylist);

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
    setExcluirPlaylist,
    getBuscarPlaylist,
    getListarPlaylists,
    setInserirNovaPlaylist,
    setAtualizarPlaylist
};
