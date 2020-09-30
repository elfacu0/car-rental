const CarService = require('../carService');
const CarNotDefinedError = require('../error/carNotDefinedError');
const CarIdNotDefinedError = require('../error/carIdNotDefinedError');
const Car = require('../../entity/car');

const repositoryMock = {
    save: jest.fn(),
    delete: jest.fn(),
    getById: jest.fn(),
    getAll: jest.fn(),
};

const service = new CarService(repositoryMock);

test('Guardar un auto llama al método save del repositorio 1 vez', () => {
    service.save({});
    expect(repositoryMock.save).toHaveBeenCalledTimes(1);
});

test('Llamar a guardar un auto sin pasar un auto da un error específico', async () => {
    await expect(service.save).rejects.toThrowError(CarNotDefinedError);
});

test('Eliminar un auto llama al método delete del repositorio 1 vez', () => {
    service.delete(new Car({ id: 1 }));
    expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
});

test('Llamar a eliminar un auto sin pasar un auto da un error específico', async () => {
    await expect(service.delete).rejects.toThrowError(CarNotDefinedError);
});

test('Consultar un auto por id llama al método get del repositorio 1 vez', () => {
    service.getById(1);
    expect(repositoryMock.getById).toHaveBeenCalledTimes(1);
});

test('Llamar a consultar un auto sin pasar un auto da un error específico', async () => {
    await expect(service.getById).rejects.toThrowError(CarIdNotDefinedError);
});

test('Consultar todos los auto llama al método getAll del repositorio 1 vez', () => {
    service.getAll();
    expect(repositoryMock.getAll).toHaveBeenCalledTimes(1);
});
