const CarController = require('../carController');
const Car = require('../../entity/car');

const serviceMock = {
    save: jest.fn(),
    delete: jest.fn(() => Promise.resolve(true)),
    getById: jest.fn(() => Promise.resolve({})),
    getAll: jest.fn(() => Promise.resolve([])),
};
const controller = new CarController({}, serviceMock);

test('Index renders index.html', async () => {
    const renderMock = jest.fn();

    await controller.index(
        { session: { errors: [], messages: [] } },
        { render: renderMock }
    );

    expect(renderMock).toHaveBeenCalledTimes(1);
    expect(renderMock).toHaveBeenCalledWith('car/view/index.html', {
        data: { cars: [] },
        admin: true,
        errors: [],
        messages: [],
    });
});

test('Create renders form.html', async () => {
    const renderMock = jest.fn();
    await controller.create({}, { render: renderMock });

    expect(renderMock).toHaveBeenCalledTimes(1);
    expect(renderMock).toHaveBeenCalledWith('car/view/form.html', {
        data: {},
    });
});

test('Save llama al servicio con el body y redirecciona a /car', async () => {
    const redirectMock = jest.fn();
    const FAKE_IMAGE_URL = 'ejemplo/image.png';
    const bodyMock = new Car({
        id: 1,
        imageSrc: FAKE_IMAGE_URL,
        brand: undefined,
        model: undefined,
        year: undefined,
        kms: undefined,
        color: undefined,
        hasAirConditioning: false,
        seats: undefined,
        hasAutomaticTransmission: false,
        priceInCents: 0,
    });

    await controller.save(
        { body: bodyMock, file: { path: FAKE_IMAGE_URL }, session: {} },
        { redirect: redirectMock }
    );

    expect(serviceMock.save).toHaveBeenCalledTimes(1);
    expect(serviceMock.save).toHaveBeenCalledWith(bodyMock);
    expect(redirectMock).toHaveBeenCalledTimes(1);
    expect(redirectMock).toHaveBeenCalledWith('/car');
});

test('Delete llama al servicio con el id del body y redirecciona a /car', async () => {
    const FAKE_CAR = new Car({ id: 1 });
    serviceMock.getById.mockImplementationOnce(() => Promise.resolve(FAKE_CAR));
    const redirectMock = jest.fn();

    await controller.delete(
        { params: { id: 1 }, session: {} },
        { redirect: redirectMock }
    );

    expect(serviceMock.delete).toHaveBeenCalledTimes(1);
    expect(serviceMock.delete).toHaveBeenCalledWith(FAKE_CAR);
    expect(redirectMock).toHaveBeenCalledTimes(1);
    expect(redirectMock).toHaveBeenCalledWith('/car');
});
