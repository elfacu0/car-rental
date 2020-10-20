const CarController = require('../carController');
const Car = require('../../entity/car');
const CarIdNotDefinedError = require('../error/carIdNotDefinedError');

const serviceMock = {
    save: jest.fn(),
    delete: jest.fn(() => Promise.resolve(true)),
    getById: jest.fn(() => Promise.resolve({})),
    getAll: jest.fn(() => Promise.resolve([])),
};
const controller = new CarController({ single: () => {} }, serviceMock);

test('configura las rutas', () => {
    const app = {
        get: jest.fn(),
        post: jest.fn(),
    };
    controller.configureRoutes(app);
    expect(app.post).toHaveBeenCalledWith(
        `${controller.ROUTE_BASE}/save`,
        undefined,
        expect.any(Function)
    );
    expect(app.post.mock.calls[0][2].name).toBe('bound save');

    expect(app.get).toHaveBeenCalledWith(
        `${controller.ROUTE_BASE}/create`,
        expect.any(Function)
    );
    expect(app.get.mock.calls[0][1].name).toBe('bound create');

    expect(app.get).toHaveBeenCalledWith(
        `${controller.ROUTE_BASE}`,
        expect.any(Function)
    );
    expect(app.get.mock.calls[1][1].name).toBe('bound index');

    expect(app.get).toHaveBeenCalledWith(
        `${controller.ROUTE_BASE}/view/:id`,
        expect.any(Function)
    );
    expect(app.get.mock.calls[2][1].name).toBe('bound view');

    expect(app.get).toHaveBeenCalledWith(
        `${controller.ROUTE_BASE}/delete/:id`,
        expect.any(Function)
    );
    expect(app.get.mock.calls[3][1].name).toBe('bound delete');
});

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

test('View renderea form.html con id valido', async () => {
    const renderMock = jest.fn();

    await controller.view(
        { params: { id: 1 }, session: { errors: [], messages: [] } },
        { render: renderMock }
    );

    expect(renderMock).toHaveBeenCalledTimes(1);
    expect(renderMock).toHaveBeenCalledWith('car/view/form.html', {
        data: { car: {} },
    });
});

test('View NO renderea form.html con id invalido', async () => {
    const renderMock = jest.fn();
    const req = { params: { id: 0 }, session: { errors: [], messages: [] } };
    await expect(controller.view(req, { render: renderMock })).rejects.toThrow(
        CarIdNotDefinedError
    );
    expect(renderMock).not.toHaveBeenCalledWith('car/view/form.html', {
        data: { car: {} },
    });
});

test('View NO renderea form.html, carga un error y redirecciona', async () => {
    const renderMock = jest.fn();
    const redirectMock = jest.fn();
    serviceMock.getById.mockImplementationOnce(() => {
        throw Error('error');
    });
    const req = {
        params: { id: 1 },
        session: { errors: [], messages: [] },
    };

    await controller.view(req, { render: renderMock, redirect: redirectMock });

    expect(req.session.errors).not.toEqual([]);
    expect(renderMock).not.toHaveBeenCalledWith('car/view/form.html', {
        data: { car: {} },
    });
    expect(redirectMock).toHaveBeenCalledTimes(1);
});

test('Save llama al servicio con un car existente y redirecciona a /car', async () => {
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

    const req = { body: bodyMock, file: { path: FAKE_IMAGE_URL }, session: {} };

    await controller.save(req, { redirect: redirectMock });

    expect(serviceMock.save).toHaveBeenCalledTimes(1);
    expect(serviceMock.save).toHaveBeenCalledWith(bodyMock);
    expect(redirectMock).toHaveBeenCalledTimes(1);
    expect(req.session.messages).not.toEqual([]);
    expect(req.session.errors).toEqual();
    expect(redirectMock).toHaveBeenCalledWith('/car');
});

test('Save llama al servicio con un nuevo car y redirecciona a /car', async () => {
    const redirectMock = jest.fn();
    const FAKE_IMAGE_URL = 'ejemplo/image.png';
    const bodyMock = new Car({
        id: NaN,
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

    const req = { body: bodyMock, file: { path: FAKE_IMAGE_URL }, session: {} };

    await controller.save(req, { redirect: redirectMock });

    expect(serviceMock.save).toHaveBeenLastCalledWith(bodyMock);
    expect(redirectMock).toHaveBeenCalledTimes(1);
    expect(req.session.messages).not.toEqual([]);
    expect(req.session.errors).not.toEqual([]);
    expect(redirectMock).toHaveBeenCalledWith('/car');
});

test('Save llama al servicio sin body,carga error y redirecciona a /car', async () => {
    const redirectMock = jest.fn();
    const req = { body: {}, session: {} };
    await controller.save(req, { redirect: redirectMock });
    serviceMock.save.mockImplementationOnce(() => {
        throw Error('Error');
    });
    expect(req.session.errors).not.toEqual([]);
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

test('Delete llama al servicio, recibe un error,lo carga y  redirecciona a /customer', async () => {
    const FAKE_CAR = new Car({ id: 1 });
    serviceMock.delete.mockImplementationOnce(() => {
        throw Error('error');
    });
    const redirectMock = jest.fn();
    const req = { params: { id: 1 }, session: {} };

    await controller.delete(req, { redirect: redirectMock });

    expect(serviceMock.delete).toHaveBeenCalledTimes(2);
    expect(serviceMock.delete).toHaveBeenCalledWith(FAKE_CAR);
    expect(req.session.errors).not.toEqual([]);
    expect(redirectMock).toHaveBeenCalledTimes(1);
    expect(redirectMock).toHaveBeenCalledWith('/car');
});

test('Delete llama al servicio, recibe un error,lo carga y  redirecciona a /car', async () => {
    serviceMock.getById.mockImplementationOnce(() => {
        throw Error('error');
    });
    const redirectMock = jest.fn();
    const req = { params: { id: 1 }, session: {} };

    await controller.delete(req, { redirect: redirectMock });

    expect(req.session.errors).not.toEqual([]);
    expect(redirectMock).toHaveBeenCalledTimes(1);
    expect(redirectMock).toHaveBeenCalledWith('/car');
});
