const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'js-gym-db',    
  'root',        
  'password123!',       
  {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

export default sequelize;
