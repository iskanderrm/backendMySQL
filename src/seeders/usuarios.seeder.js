require('dotenv').config();
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');
const Usuario = require('../models/usuarios.model');

const saltosBcrypt = parseInt(process.env.SALTOS_BCRYPT);

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

const seedUsuarios = async () => {
  try {
    await sequelize.authenticate();  

    await Usuario.sync({ force: true }); 
    

    const usuariosDePrueba = [];
    for (let i = 1; i <= 10; i++) {
      const nombre = `Usuario${i}`;
      const apellido = `Apellido${i}`;
      const usuario = `usuario${i}`;
      const password = `password${i}`;
      const hashedPassword = await bcrypt.hash(password, saltosBcrypt);

      const nuevoUsuario = {
        nombre,
        apellido,
        usuario,
        password: hashedPassword,
        created_by: 'Seeder',
      };

      usuariosDePrueba.push(nuevoUsuario);
    }

    await Usuario.bulkCreate(usuariosDePrueba);

    console.log('Usuarios de prueba insertados exitosamente.');

    sequelize.close();
  } catch (error) {
    console.error('Error al insertar usuarios de prueba', error);
  }
};

seedUsuarios();
