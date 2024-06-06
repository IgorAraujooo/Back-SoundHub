/********************************************************
 * Objetivo: Arquivo para realizar as requisições de músicas
 * Data: 23/05/2024
 * Autor: Igor Araujo
 * Versão: 1.0
 ********************************************************/

/**********************************************
 * Para realizar a conexão com o banco de dados 
 * precisamos utilizar uma dependencia:
 *    - SEQUELIZE ORM
 *    - PRISMA    ORM 
 *    - FASTFY    ORM
 * 
 * Prisma - Para utilizar o prisma é necessário os comandos abaixos
 *     npm install prisma --save
 *     npm install @prisma/client --save
 *     
 * Para inicializar o prisma:
 *     npx prisma init
 * 
 *******************************************/

/***************************************************************************************************
 *  Para realizar a conexão com o Banco de dados precisamos utilizar uma dependência
 *     - SEQUELIZE ORM
 *     - PRISMA ORM
 *     - FASTFY ORM
 *  
 * - Prisma
 *      npm install prisma --save
 *      npm install @prisma/client --save
 *      Após a instalação do prisma, devemos rodar o comando abaixo para incializar o prisma
 *      npx prisma init
 **************************************************************************************************/


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Cria um objeto do tipo JSON para receber os dados via body nas requisições POST ou PUT
const bodyParserJSON = bodyParser.json();

// *************************** Imports de arquivos e bibliotecas ************************************ //

const controllerMusica = require('./controller/controller_musicas.js')
const controllerArtista = require('./controller/controller_artista.js')
const controllerAlbum = require('./controller/controller_album.js')
const controllerUsuario = require('./controller/controller_usuario.js');
const controllerGenero = require('./controller/controller_genero.js')
const controllerPlaylist = require('./controller/controller_playlist.js');

// ************************************************************************************************* //
// Função para configurar as permissões do cors
app.use((request, response, next) => {
    // Configura quem poderá fazer requisições na API (* - libera para todos | IP restringe o acesso)
    response.header('Access-Control-Allow-Origin', '*');
    // Configura os métodos que poderão ser utilizados na API (GET, POST, PUT e DELETE)
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    app.use(cors());

    next();
});



// Rota para listar as músicas
app.get('/v1/soundhub/musicas', cors(), async function(request, response, next) {
    // Chama a função para retornar os dados das músicas
    let dadosMusica = await controllerMusica.getListarMusicas();

    // Validação para verificar se existem dados
    if (dadosMusica) {
        response.status(200).json(dadosMusica);
    } else {
        response.status(404).json({ message: 'Nenhum registro encontrado' });
    }
});

// Rota para buscar uma música pelo ID
app.get('/v1/soundhub/musica/:id', cors(), async function(request, response, next) {
    // Recebe o ID da requisição 
    let idMusica = request.params.id;
  
    // Solicita para o controller a música filtrando pelo ID
    let dadosMusica = await controllerMusica.getBuscarMusica(idMusica);
  
    response.status(dadosMusica.status_code).json(dadosMusica);
});

// Rota para inserir uma nova música
app.post('/v1/soundhub/inserirMusica', cors(), bodyParserJSON, async function(request, response, next) {
    // Recebe o content-type da requisição (API deve receber application/json)
    let contentType = request.headers['content-type'];

    // Recebe os dados encaminhados na requisição do body (JSON)
    let dadosBody = request.body;
   
    // Encaminha os dados da requisição para a controller enviar para o banco de dados
    let resultDados = await controllerMusica.setInserirNovaMusica(dadosBody, contentType);

    response.status(resultDados.status_code).json(resultDados);
});

// Rota para excluir uma música pelo ID
app.delete('/v1/soundhub/musica/:id', cors(), async function(request, response, next) {
    // Recebe o ID da requisição
    let idMusica = request.params.id;

    // Encaminha os dados para a controller excluir a música
    let resultDados = await controllerMusica.setExcluirMusica(idMusica);

    response.status(resultDados.status_code).json(resultDados)
});

app.put('/v1/soundhub/music/:id', cors(), bodyParserJSON, async function(request, response, next) {
    let idMusic = request.params.id;
    let novosDadosMusic = request.body;
    let result = await controllerMusica.setAtualizarMusica(idMusic, novosDadosMusic);
    response.status(result.status_code).json(result);
});


////////////////////////////////////////////////////////////////////// End Point Artistas ///////////////////////////////////////////////////////////////////////////////////////////

app.get('/v1/soundhub/artistas', cors(), async function(request, response, next) {
    // Chama a função para retornar os dados das músicas
    let dadosArtista = await controllerArtista.getListarArtista();

    // Validação para verificar se existem dados
    if (dadosArtista) {
        response.status(200).json(dadosArtista);
    } else {
        response.status(404).json({ message: 'Nenhum registro encontrado' });
    }
});


app.get('/v1/soundhub/artista/:id', cors(), async function(request, response, next) {
    // Recebe o id da requisição 
    let idArtista = request.params.id;
  
    // Solicita para a controller a música filtrando pelo id
    let dadosArtista = await controllerArtista.getBuscarArtista(idArtista);
  
    response.status(dadosArtista.status_code).json(dadosArtista);
});


app.post('/v1/soundhub/Inserirartista', cors(), bodyParserJSON, async function(request, response, next) {
    // Recebe o content-type da requisição (API deve receber application/json)
    let contentType = request.headers['content-type'];

    // Recebe os dados encaminhados na requisição do body (JSON)
    let dadosBody = request.body;
   
    // Encaminha os dados da requisição para a controller enviar para o banco de dados
    let resultDados = await controllerArtista.setInserirNovoArtista(dadosBody, contentType);

    response.status(resultDados.status_code).json(resultDados);
});


app.delete('/v1/soundhub/artista/:id', cors(), async function(request, response, next) {
    // Recebe o id da requisição
    let idArtista = request.params.id;

    // Encaminha os dados para a controller excluir a música
    let resultDados = await controllerArtista.setExcluirArtista(idArtista);

    response.status(resultDados.status_code).json(resultDados);
});

// Rota para atualizar um artista pelo ID
app.put('/v1/soundhub/artista/:id', cors(), bodyParserJSON, async function(request, response, next) {
    // Recebe o ID da requisição
    let idArtista = request.params.id;

    // Recebe os novos dados do artista do body da requisição
    let novosDadosArtista = request.body;

    // Encaminha os dados para a controller atualizar o artista
    let resultDados = await controllerArtista.setAtualizarArtista(idArtista, novosDadosArtista);

    response.status(resultDados.status_code).json(resultDados);
});


////////////////////////////////////////////////////////////////////// End Point Albuns ///////////////////////////////////////////////////////////////////////////////////////////

app.get('/v1/soundhub/albuns', cors(), async function(request, response, next) {
    // Chama a função para retornar os dados dos álbuns
    let dadosAlbum = await controllerAlbum.getListarAlbuns();

    // Validação para verificar se existem dados
    if (dadosAlbum) {
        response.status(200).json(dadosAlbum);
    } else {
        response.status(404).json({ message: 'Nenhum registro encontrado' });
    }
});

app.get('/v1/soundhub/album/:id', cors(), async function(request, response, next) {
    // Recebe o id da requisição 
    let idAlbum = request.params.id;
  
    // Solicita para a controller o álbum filtrando pelo id
    let dadosAlbum = await controllerAlbum.getBuscarAlbum(idAlbum);
  
    response.status(dadosAlbum.status_code).json(dadosAlbum);
});

app.post('/v1/soundhub/inserirAlbum', cors(), bodyParserJSON, async function(request, response, next) {
    // Recebe o content-type da requisição (API deve receber application/json)
    let contentType = request.headers['content-type'];

    // Recebe os dados encaminhados na requisição do body (JSON)
    let dadosBody = request.body;
   
    // Encaminha os dados da requisição para a controller enviar para o banco de dados
    let resultDados = await controllerAlbum.setInserirNovoAlbum(dadosBody, contentType);

    response.status(resultDados.status_code).json(resultDados);
});

app.delete('/v1/soundhub/album/:id', cors(), async function(request, response, next) {
    // Recebe o id da requisição
    let idAlbum = request.params.id;

    // Encaminha os dados para a controller excluir a música
    let resultDados = await controllerAlbum.setExcluirAlbum(idAlbum);

    response.status(resultDados.status_code).json(resultDados)
});

// Rota para atualizar um álbum pelo ID
app.put('/v1/soundhub/album/:id', cors(), bodyParserJSON, async function(request, response, next) {
    // Recebe o ID da requisição
    let idAlbum = request.params.id;

    // Recebe o content-type da requisição (API deve receber application/json)
    let contentType = request.headers['content-type'];

    // Recebe os novos dados encaminhados na requisição do body (JSON)
    let novosDadosAlbum = request.body;

    // Encaminha os dados para a controller atualizar o álbum
    let resultDados = await controllerAlbum.setAtualizarAlbum(idAlbum, novosDadosAlbum, contentType);

    response.status(resultDados.status_code).json(resultDados);
});


////////////////////////////////////////////////////////////////////// End Point Usuarios ///////////////////////////////////////////////////////////////////////////////////////////

// Rota para listar os usuários
app.get('/v1/soundhub/usuarios', cors(), async function(request, response, next) {
    // Chama a função para retornar os dados dos usuários
    let dadosUsuario = await controllerUsuario.getListarUsuarios();

    // Validação para verificar se existem dados
    if (dadosUsuario) {
        response.status(200).json(dadosUsuario);
    } else {
        response.status(404).json({ message: 'Nenhum registro encontrado' });
    }
});

// Rota para buscar um usuário pelo ID
app.get('/v1/soundhub/usuario/:id', cors(), async function(request, response, next) {
    // Recebe o ID da requisição 
    let idUsuario = request.params.id;
  
    // Solicita para o controller o usuário filtrando pelo ID
    let dadosUsuario = await controllerUsuario.getBuscarUsuario(idUsuario);
  
    response.status(dadosUsuario.status_code).json(dadosUsuario);
});

// Rota para inserir um novo usuário
app.post('/v1/soundhub/inserirUsuario', cors(), bodyParserJSON, async function(request, response, next) {
    // Recebe o content-type da requisição (API deve receber application/json)
    let contentType = request.headers['content-type'];

    // Recebe os dados encaminhados na requisição do body (JSON)
    let dadosBody = request.body;
   
    // Encaminha os dados da requisição para a controller enviar para o banco de dados
    let resultDados = await controllerUsuario.setInserirNovoUsuario(dadosBody, contentType);

    response.status(resultDados.status_code).json(resultDados);
});

// Rota para excluir um usuário pelo ID
app.delete('/v1/soundhub/usuario/:id', cors(), async function(request, response, next) {
    // Recebe o ID da requisição
    let idUsuario = request.params.id;

    // Encaminha os dados para a controller excluir o usuário
    let resultDados = await controllerUsuario.setExcluirUsuario(idUsuario);

    response.status(resultDados.status_code).json(resultDados)
});

app.put('/v1/soundhub/usuario/:id', cors(), bodyParserJSON, async function(request, response, next) {
    // Recebe o ID da requisição
    let idUsuario = request.params.id;

    // Recebe o content-type da requisição (API deve receber application/json)
    let contentType = request.headers['content-type'];

    // Recebe os novos dados encaminhados na requisição do body (JSON)
    let novosDadosUsuario = request.body;

    // Encaminha os dados para a controller atualizar o usuario
    let resultDados = await controllerUsuario.setAtualizarUsuario(idUsuario, novosDadosUsuario, contentType);

    response.status(resultDados.status_code).json(resultDados);
});

////////////////////////////////////////////////////////////////////// End Point Generos ///////////////////////////////////////////////////////////////////////////////////////////

// Rota para listar os gêneros musicais
app.get('/v1/soundhub/generos', cors(), async function(request, response, next) {
    // Chama a função para retornar os dados dos usuários
    let dadosGenero = await controllerGenero.getListarGeneros();

    // Validação para verificar se existem dados
    if (dadosGenero) {
        response.status(200).json(dadosGenero);
    } else {
        response.status(404).json({ message: 'Nenhum registro encontrado' });
    }
});

// Rota para buscar um gênero musical pelo ID
app.get('/v1/soundhub/genero/:id', cors(), async function(request, response, next) {
    // Recebe o ID da requisição 
    let idGenero = request.params.id;
  
    // Solicita para o controller o gênero musical filtrando pelo ID
    let dadosGenero = await controllerGenero.getBuscarGenero(idGenero);
  
    response.status(dadosGenero.status_code).json(dadosGenero);
});

// Rota para inserir um novo gênero musical
app.post('/v1/soundhub/inserirGenero', cors(), bodyParserJSON, async function(request, response, next) {
    // Recebe o content-type da requisição (API deve receber application/json)
    let contentType = request.headers['content-type'];

    // Recebe os dados encaminhados na requisição do body (JSON)
    let dadosBody = request.body;
   
    // Encaminha os dados da requisição para a controller enviar para o banco de dados
    let resultDados = await controllerGenero.setInserirNovoGenero(dadosBody, contentType);

    response.status(resultDados.status_code).json(resultDados);
});

// Rota para excluir um gênero musical pelo ID
app.delete('/v1/soundhub/genero/:id', cors(), async function(request, response, next) {
    // Recebe o ID da requisição
    let idGenero = request.params.id;

    // Encaminha os dados para a controller excluir o gênero musical
    let resultDados = await controllerGenero.setExcluirGenero(idGenero);

    response.status(resultDados.status_code).json(resultDados)
});

// Rota para atualizar um gênero pelo ID
app.put('/v1/soundhub/genero/:id', cors(), bodyParserJSON, async function(request, response, next) {
    // Recebe o ID da requisição
    let idGenero = request.params.id;

    // Recebe os novos dados do gênero do body da requisição
    let novosDadosGenero = request.body;

    // Encaminha os dados para a controller atualizar o gênero
    let resultDados = await controllerGenero.setAtualizarGenero(idGenero, novosDadosGenero);

    response.status(resultDados.status_code).json(resultDados);
});


////////////////////////////////////////////////////////////////////// End Point Playlist ///////////////////////////////////////////////////////////////////////////////////////////

// Rota para listar as playlists
app.get('/v1/soundhub/playlists', cors(), async function(request, response, next) {
    // Chama a função para retornar os dados das playlists
    let dadosPlaylist = await controllerPlaylist.getListarPlaylists();

    // Validação para verificar se existem dados
    if (dadosPlaylist) {
        response.status(200).json(dadosPlaylist);
    } else {
        response.status(404).json({ message: 'Nenhum registro encontrado' });
    }
});

// Rota para buscar uma playlist pelo ID
app.get('/v1/soundhub/playlist/:id', cors(), async function(request, response, next) {
    // Recebe o ID da requisição 
    let idPlaylist = request.params.id;
  
    // Solicita para o controller a playlist filtrando pelo ID
    let dadosPlaylist = await controllerPlaylist.getBuscarPlaylist(idPlaylist);
  
    response.status(dadosPlaylist.status_code).json(dadosPlaylist);
});

// Rota para inserir uma nova playlist
app.post('/v1/soundhub/inserirPlaylist', cors(), bodyParserJSON, async function(request, response, next) {
    // Recebe o content-type da requisição (API deve receber application/json)
    let contentType = request.headers['content-type'];

    // Recebe os dados encaminhados na requisição do body (JSON)
    let dadosBody = request.body;
   
    // Encaminha os dados da requisição para a controller enviar para o banco de dados
    let resultDados = await controllerPlaylist.setInserirNovaPlaylist(dadosBody, contentType);

    response.status(resultDados.status_code).json(resultDados);
});

// Rota para excluir uma playlist pelo ID
app.delete('/v1/soundhub/playlist/:id', cors(), async function(request, response, next) {
    // Recebe o ID da requisição
    let idPlaylist = request.params.id;

    // Encaminha os dados para a controller excluir a playlist
    let resultDados = await controllerPlaylist.setExcluirPlaylist(idPlaylist);

    response.status(resultDados.status_code).json(resultDados)
});

// Rota para atualizar uma playlist pelo ID
app.put('/v1/soundhub/playlist/:id', cors(), bodyParserJSON, async function(request, response, next) {
    let idPlaylist = request.params.id;
    let novosDadosPlaylist = request.body;
    let result = await controllerPlaylist.setAtualizarPlaylist(idPlaylist, novosDadosPlaylist);
    response.status(result.status_code).json(result);
});




app.listen(8080, function() {
    console.log('API funcionando!!!!');
});
