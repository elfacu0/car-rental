const Sequelize = require('sequelize');
const RentalModel = require('../rentalModel');
const CustomerModel = require('../../../customer/model/customerModel');
const CarModel = require('../../../car/model/carModel');

const sequelizeInstance = new Sequelize('sqlite::memory');

test('Después de hacerle un setup a Rental Model y sincronizar el modelo, la tabla rentals existe', async () => {
    RentalModel.setup(sequelizeInstance);
    CustomerModel.setup(sequelizeInstance);
    CarModel.setup(sequelizeInstance);
    RentalModel.setupAssociations(CustomerModel, CarModel);
    await RentalModel.sync({ force: true });
    expect(await RentalModel.findAll()).toEqual([]);
});
