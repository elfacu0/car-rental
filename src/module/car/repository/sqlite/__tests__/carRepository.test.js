const { Sequelize } = require('sequelize');
const CarRepository = require('../carRepository');
const CarModel = require('../../../model/carModel');
const CarEntity = require('../../../entity/car');
const CarNotFoundError = require('../../error/carNotFoundError');
const CarIdNotDefinedError = require('../../error/carIdNotDefinedError');
const RentalModel = require('../../../../rental/model/rentalModel');
const CustomerModel = require('../../../../customer/model/customerModel');

const sequelizeInstance = new Sequelize('sqlite::memory');

/**
 * @type CarRepository
 */
let repository;

const sampleCar = new CarEntity({
    id: 0,
    imageSrc:
        'https://www.kayak.com/h/run/api/image?caller=Cars&height=196&crop=true&url=/carimages/generic/02_economy_red.png',
    brand: 'toyota',
    model: 'Yaris',
    year: 2020,
    kms: 2030,
    color: 'Red',
    hasAirConditioning: true,
    seats: 4,
    hasAutomaticTransmission: true,
    priceInCents: 40005,
});

beforeAll(() => {
    const car = CarModel.setup(sequelizeInstance);
    const rental = RentalModel.setup(sequelizeInstance);
    CustomerModel.setup(sequelizeInstance);
    car.hasMany(rental, {
        foreignKey: 'carId',
        as: 'rentals',
    });
    repository = new CarRepository(car);
});

beforeEach(async (done) => {
    await sequelizeInstance.sync({ force: true });
    done();
});

test('Crea un auto cuando la entidad no tiene id', async () => {
    const NEW_AUTOGENERATED_ID = 1;
    const newCar = await repository.save(sampleCar);
    expect(newCar.id).toEqual(NEW_AUTOGENERATED_ID);
});

test('Busca un auto y espera que devuelva una entidad de auto', async () => {
    const NEW_AUTOGENERATED_ID = 1;
    const newCar = await repository.save(sampleCar);
    await expect(
        repository.getById(NEW_AUTOGENERATED_ID)
    ).resolves.toBeInstanceOf(CarEntity);
});

test('Actualiza un auto cuando la entidad tiene un id', async () => {
    const NEW_AUTOGENERATED_ID = 1;
    const newCar = await repository.save(sampleCar);
    expect(newCar.id).toEqual(NEW_AUTOGENERATED_ID);

    const NEW_MODEL = 'etios';
    newCar.model = NEW_MODEL;
    const modifiedCar = await repository.save(newCar);
    expect(modifiedCar.id).toEqual(NEW_AUTOGENERATED_ID);
    expect(modifiedCar.model).toEqual(NEW_MODEL);
});

test('Borrar un auto existente devuelve true, lo busca y espera un error', async () => {
    const NEW_AUTOGENERATED_ID = 1;
    const newCar = await repository.save(sampleCar);
    expect(newCar.id).toEqual(NEW_AUTOGENERATED_ID);
    await expect(repository.delete(newCar)).resolves.toEqual(true);
    await expect(repository.getById(NEW_AUTOGENERATED_ID)).rejects.toThrow(
        CarNotFoundError
    );
});

test('Borrar un auto sin parámetros da error', async () => {
    await expect(repository.delete()).rejects.toThrow(CarIdNotDefinedError);
});

test('Borrar un auto sin id da error', async () => {
    await expect(repository.delete({})).rejects.toThrow(CarIdNotDefinedError);
});

test('Borrar un auto con id inexistente devuelve false', async () => {
    await expect(repository.delete({ id: 1 })).resolves.toEqual(false);
});

test('Devuelve todos los autos existentes estando la base de datos vacia', async () => {
    await expect(repository.getAll()).resolves.toEqual([]);
});

test('Devuelve todos los autos existentes luego de crear un solo auto ', async () => {
    const NEW_AUTOGENERATED_ID = 1;
    const newCar = await repository.save(sampleCar);
    await expect(repository.getAll()).resolves.toHaveLength(1);
});
