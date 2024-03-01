CREATE TABLE papeis (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45)
);
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    senha VARCHAR(45),
    id_papel INT,
    FOREIGN KEY (id_papel) REFERENCES papeis(id)
);
CREATE TABLE placas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    lado VARCHAR(45)
);
