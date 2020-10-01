const CustomerService = require('../customerService');
const CustomerNotDefinedError = require('../error/customerNotDefinedError');
const CustomerIdNotDefinedError = require('../error/customerIdNotDefinedError');
const Customer = require('../../entity/customer');

const repositoryMock = {
    save: jest.fn(),
    delete: jest.fn(),
    getById: jest.fn(),
    getAll: jest.fn(),
};

const service = new CustomerService(repositoryMock);

test('Guardar un customer llama al método save del repositorio 1 vez', () => {
    service.save({});
    expect(repositoryMock.save).toHaveBeenCalledTimes(1);
});

test('Llamar a guardar un customer sin pasar un customer da un error específico', async () => {
    await expect(service.save).rejects.toThrowError(CustomerNotDefinedError);
});

test('Eliminar un customer llama al método delete del repositorio 1 vez', () => {
    service.delete(new Customer({ id: 1 }));
    expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
});

test('Llamar a eliminar un customer sin pasar un customer da un error específico', async () => {
    await expect(service.delete).rejects.toThrowError(CustomerNotDefinedError);
});

test('Consultar un customer por id llama al método get del repositorio 1 vez', () => {
    service.getById(1);
    expect(repositoryMock.getById).toHaveBeenCalledTimes(1);
});

test('Llamar a consultar un customer sin pasar un customer da un error específico', async () => {
    await expect(service.getById).rejects.toThrowError(
        CustomerIdNotDefinedError
    );
});

test('Consultar todos los customers llama al método getAll del repositorio 1 vez', () => {
    service.getAll();
    expect(repositoryMock.getAll).toHaveBeenCalledTimes(1);
});
