CREATE DATABASE projeto_soundhub;

USE projeto_soundhub;

CREATE TABLE tbl_usuarios (
    id_usuarios INT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100),
    senha VARCHAR(10)
);

CREATE TABLE tbl_genero (
    id_genero INT PRIMARY KEY,
    nome VARCHAR(20)
);

CREATE TABLE tbl_artista (
    id_artista INT PRIMARY KEY,
    nome VARCHAR(80),
    data_nascimento VARCHAR(10),
    foto_artista VARCHAR(200),
    id_genero INT,
    FOREIGN KEY (id_genero) REFERENCES tbl_genero(id_genero)
);

CREATE TABLE tbl_album (
    id_album INT PRIMARY KEY,
    nome VARCHAR(50),
    foto_capa VARCHAR(20),
    data_lancamento VARCHAR(10),
    id_genero INT,
    FOREIGN KEY (id_genero) REFERENCES tbl_genero(id_genero)
);

CREATE TABLE tbl_musica (
    id_musica INT PRIMARY KEY,
    nome VARCHAR(80),
    duracao TIME,
    foto_capa VARCHAR(200),
    id_playlist INT,
    id_album INT,
    URL VARCHAR(45),
    FOREIGN KEY (id_playlist) REFERENCES tbl_playlist(id_playlist),
    FOREIGN KEY (id_album) REFERENCES tbl_album(id_album)
);

CREATE TABLE tbl_playlist (
    id_playlist INT PRIMARY KEY,
    nome VARCHAR(50)
);

CREATE TABLE tbl_usuario_playlist (
    id_usuario_playlist INT PRIMARY KEY,
    id_usuarios INT,
    id_playlist INT,
    FOREIGN KEY (id_usuarios) REFERENCES tbl_usuarios(id_usuarios),
    FOREIGN KEY (id_playlist) REFERENCES tbl_playlist(id_playlist)
);

CREATE TABLE tbl_playlists (
    id_playlist_musica INT PRIMARY KEY,
    id_playlist INT,
    id_musica INT,
    FOREIGN KEY (id_playlist) REFERENCES tbl_playlist(id_playlist),
    FOREIGN KEY (id_musica) REFERENCES tbl_musica(id_musica)
);

CREATE TABLE tbl_usuario_musica (
    id_usuario_musica INT PRIMARY KEY,
    id_usuarios INT,
    id_musica INT,
    FOREIGN KEY (id_usuarios) REFERENCES tbl_usuarios(id_usuarios),
    FOREIGN KEY (id_musica) REFERENCES tbl_musica(id_musica)
);

CREATE TABLE tbl_musica_album (
    id_musica_album INT PRIMARY KEY,
    id_musica INT,
    id_album INT,
    FOREIGN KEY (id_musica) REFERENCES tbl_musica(id_musica),
    FOREIGN KEY (id_album) REFERENCES tbl_album(id_album)
);

CREATE TABLE tbl_artista_album (
    id_artista_album INT PRIMARY KEY,
    id_artista INT,
    id_album INT,
    FOREIGN KEY (id_artista) REFERENCES tbl_artista(id_artista),
    FOREIGN KEY (id_album) REFERENCES tbl_album(id_album)
);

CREATE TABLE tbl_musica_genero (
    id_musica_genero INT PRIMARY KEY,
    id_musica INT,
    id_genero INT,
    FOREIGN KEY (id_musica) REFERENCES tbl_musica(id_musica),
    FOREIGN KEY (id_genero) REFERENCES tbl_genero(id_genero)
);

CREATE TABLE tbl_musica_artista (
    id_musica_artista INT PRIMARY KEY,
    id_musica INT,
    id_artista INT,
    FOREIGN KEY (id_musica) REFERENCES tbl_musica(id_musica),
    FOREIGN KEY (id_artista) REFERENCES tbl_artista(id_artista)
);