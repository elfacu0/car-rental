const { Sequelize } = require('sequelize');
const CustomerRepository = require('../customerRepository');
const CustomerModel = require('../../../model/customerModel');
const CustomerEntity = require('../../../entity/customer');
const CustomerNotFoundError = require('../../error/customerNotFoundError');
const CustomerIdNotDefinedError = require('../../error/customerIdNotDefinedError');

const sequelizeInstance = new Sequelize('sqlite::memory');

/**
 * @type CarRepository
 */
let repository;

const sampleCustomer = new CustomerEntity({
    firstNames: 'jhon',
    lastNames: 'locke',
    documentType: 'DNI',
    documentNumber: 234959583,
    nationality: 'British',
    address: 'Western 394',
    phone: 2394924,
    email: 'elJhony@gmail.com',
    birthDate: '10-10-2000',
    isDeleted: false,
});

beforeAll(() => {
    const customer = CustomerModel.setup(sequelizeInstance);
    repository = new CustomerRepository(customer);
});

beforeEach(async (done) => {
    await sequelizeInstance.sync({ force: true });
    done();
});

test('Crea un customer cuando la entidad no tiene id', async () => {
    const NEW_AUTOGENERATED_ID = 1;
    const newCustomer = await repository.save(sampleCustomer);
    expect(newCustomer.id).toEqual(NEW_AUTOGENERATED_ID);
});

test('Busca un customer y espera que devuelva una entidad de customer', async () => {
    const NEW_AUTOGENERATED_ID = 1;
    const newCustomer = await repository.save(sampleCustomer);
    await expect(
        repository.getById(NEW_AUTOGENERATED_ID)
    ).resolves.toBeInstanceOf(CustomerEntity);
});

test('Actualiza un customer cuando la entidad tiene un id', async () => {
    const NEW_AUTOGENERATED_ID = 1;
    const newCustomer = await repository.save(sampleCustomer);
    expect(newCustomer.id).toEqual(NEW_AUTOGENERATED_ID);

    const NEW_NAME = 'Jony';
    newCustomer.firstNames = NEW_NAME;
    const modifiedCustomer = await repository.save(newCustomer);
    expect(modifiedCustomer.id).toEqual(NEW_AUTOGENERATED_ID);
    expect(modifiedCustomer.firstNames).toEqual(NEW_NAME);
});

test('Borrar un customer existente devuelve true, lo busca y espera que la key isDeleted sea true', async () => {
    const NEW_AUTOGENERATED_ID = 1;
    const newCustomer = await repository.save(sampleCustomer);
    expect(newCustomer.id).toEqual(NEW_AUTOGENERATED_ID);
    await expect(repository.delete(newCustomer)).resolves.toEqual(true);
    const deletedCustomer = await repository.getById(NEW_AUTOGENERATED_ID);
    expect(deletedCustomer.isDeleted).toEqual(true);
});

test('Borrar un customer sin parámetros da error', async () => {
    await expect(repository.delete()).rejects.toThrow(
        CustomerIdNotDefinedError
    );
});

test('Borrar un customer sin id da error', async () => {
    await expect(repository.delete({})).rejects.toThrow(
        CustomerIdNotDefinedError
    );
});

test('Borrar un customer con id inexistente devuelve false', async () => {
    await expect(repository.delete({ id: 1 })).resolves.toEqual(false);
});

test('Devuelve todos los customers existentes estando la base de datos vacia', async () => {
    await expect(repository.getAll()).resolves.toEqual([]);
});

test('Devuelve todos los customers existentes luego de crear un solo customer ', async () => {
    const NEW_AUTOGENERATED_ID = 1;
    const newCustomer = await repository.save(sampleCustomer);
    await expect(repository.getAll()).resolves.toHaveLength(1);
});