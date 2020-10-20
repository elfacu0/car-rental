const RentalService = require('../rentalService');
const RentalNotDefinedError = require('../error/rentalNotDefinedError');
const RentalIdNotDefinedError = require('../error/rentalIdNotDefinedError');
const Rental = require('../../entity/rental');

const repositoryMock = {
    save: jest.fn(),
    delete: jest.fn(),
    getById: jest.fn(),
    getAll: jest.fn(),
};

const service = new RentalService(repositoryMock);

test('Guardar un rental llama al método save del repositorio 1 vez', () => {
    service.save({});
    expect(repositoryMock.save).toHaveBeenCalledTimes(1);
});

test('Llamar a guardar un rental sin pasar un rental da un error específico', async () => {
    await expect(service.save).rejects.toThrowError(RentalNotDefinedError);
});

test('Eliminar un rental llama al método delete del repositorio 1 vez', () => {
    service.delete(new Rental({ id: 1 }));
    expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
});

test('Llamar a eliminar un rental sin pasar un rental da un error específico', async () => {
    await expect(service.delete).rejects.toThrowError(RentalNotDefinedError);
});

test('Consultar un rental por id llama al método get del repositorio 1 vez', () => {
    service.getById(1);
    expect(repositoryMock.getById).toHaveBeenCalledTimes(1);
});

test('Llamar a consultar un rental sin pasar un rental da un error específico', async () => {
    await expect(service.getById).rejects.toThrowError(RentalIdNotDefinedError);
});

test('Consultar todos los rental llama al método getAll del repositorio 1 vez', () => {
    service.getAll();
    expect(repositoryMock.getAll).toHaveBeenCalledTimes(1);
});
