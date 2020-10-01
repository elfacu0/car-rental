const Sequelize = require('sequelize');
const CustomerModel = require('../customerModel');

const sequelizeInstance = new Sequelize('sqlite::memory');

test('Después de hacerle un setup a Customewr Model y sincronizar el modelo, la tabla Customers existe', async () => {
    CustomerModel.setup(sequelizeInstance);
    await CustomerModel.sync({ force: true });
    expect(await CustomerModel.findAll()).toEqual([]);
});
