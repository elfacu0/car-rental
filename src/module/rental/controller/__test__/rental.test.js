const RentalController = require('../rentalController');
const Rental = require('../../entity/rental');
const Customer = require('../../../customer/entity/customer');
const Car = require('../../../car/entity/car');
const RentalIdNotDefinedError = require('../error/rentalIdNotDefinedError');

const serviceMock = {
    save: jest.fn(),
    delete: jest.fn(() => Promise.resolve(true)),
    getById: jest.fn(() => Promise.resolve({})),
    getAll: jest.fn(() => Promise.resolve([])),
};
const controller = new RentalController(serviceMock, serviceMock, serviceMock);
const mockCustomersData = [
    new Customer({
        id: 1,
        firstNames: undefined,
        lastNames: undefined,
        documentType: undefined,
        documentNumber: undefined,
        nationality: undefined,
        address: undefined,
        phone: undefined,
        email: undefined,
        birthDate: undefined,
    }),
];

test('configura las rutas', () => {
    const app = {
        get: jest.fn(),
        post: jest.fn(),
    };
    controller.configureRoutes(app);
    expect(app.post).toHaveBeenCalledWith(
        `${controller.ROUTE_BASE}/save`,
        expect.any(Function)
    );
    expect(app.post.mock.calls[0][1].name).toBe('bound save');

    expect(app.get).toHaveBeenCalledWith(
        `${controller.ROUTE_BASE}/create/:id?`,
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

test('Index renderea index.html', async () => {
    const renderMock = jest.fn();

    await controller.index(
        { session: { errors: [], messages: [] } },
        { render: renderMock }
    );

    expect(renderMock).toHaveBeenCalledTimes(1);
    expect(renderMock).toHaveBeenCalledWith('rental/view/index.html', {
        data: { rentals: [] },
        admin: true,
        errors: [],
        messages: [],
    });
});

test('View renderea form.html con id valido', async () => {
    const renderMock = jest.fn();

    await controller.view(
        { params: { id: 1 }, session: { errors: [], messages: [] } },
        { render: renderMock }
    );

    expect(renderMock).toHaveBeenCalledTimes(1);
    expect(renderMock).toHaveBeenCalledWith('rental/view/form.html', {
        data: { rental: {} },
    });
});

test('View NO renderea form.html con id invalido', async () => {
    const renderMock = jest.fn();
    const req = { params: { id: 0 }, session: { errors: [], messages: [] } };
    await expect(controller.view(req, { render: renderMock })).rejects.toThrow(
        RentalIdNotDefinedError
    );
    expect(renderMock).not.toHaveBeenCalledWith('rental/view/form.html', {
        data: { rental: {} },
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
    expect(renderMock).not.toHaveBeenCalledWith('rental/view/form.html', {
        data: { rental: {} },
    });
    expect(redirectMock).toHaveBeenCalledTimes(1);
});

test('Create sin recibir id renderea form.html', async () => {
    const renderMock = jest.fn();
    serviceMock.getAll.mockImplementationOnce(() => mockCustomersData);
    await controller.create({ params: {} }, { render: renderMock });

    expect(renderMock).toHaveBeenCalledTimes(1);
    expect(renderMock).toHaveBeenCalledWith('rental/view/form.html', {
        data: { customers: mockCustomersData, rental: {} },
    });
});

test('Create recibiendo id renderea form.html y le envia los datos del auto', async () => {
    const renderMock = jest.fn();
    const CAR_ID = 1;
    const req = { params: { id: CAR_ID }, session: { errors: {} } };

    const mockCarData = new Car({
        id: CAR_ID,
        imageSrc: 'fake_url',
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
    serviceMock.getAll.mockImplementationOnce(() => mockCustomersData);
    serviceMock.getById.mockImplementationOnce(() => mockCarData);
    await controller.create(req, { render: renderMock });

    expect(renderMock).toHaveBeenCalledTimes(1);
    expect(renderMock).toHaveBeenCalledWith('rental/view/form.html', {
        data: {
            customers: mockCustomersData,
            rental: {
                car: mockCarData,
                carId: mockCarData.id,
                carPricePerDayForInput: mockCarData.price,
                carPricePerDay: mockCarData.priceInCents,
            },
        },
    });
});

test('Save llama al servicio con un rental existente, carga mensaje de update y redirecciona a /rental', async () => {
    const redirectMock = jest.fn();
    const bodyMock = new Rental({
        id: 1,
        carId: NaN,
        customerId: NaN,
        carPricePerDay: NaN,
        startDate: undefined,
        endDate: undefined,
        totalPrice: NaN,
        paymentType: undefined,
        isPaid: false,
        customer: {},
        car: {},
    });
    const req = { body: bodyMock, session: {} };

    await controller.save(req, { redirect: redirectMock });

    expect(serviceMock.save).toHaveBeenCalledTimes(1);
    expect(serviceMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
            id: bodyMock.id,
            carId: bodyMock.carId,
            customerId: bodyMock.customerId,
            car: bodyMock.car,
            customer: bodyMock.customer,
        })
    );
    expect(redirectMock).toHaveBeenCalledTimes(1);
    expect(req.session.messages[0]).toEqual(
        `rental with id ${bodyMock.id} updated`
    );
    expect(redirectMock).toHaveBeenCalledWith('/rental');
});

test('Save llama al servicio con un rental nuevo, carga mensaje de creacion y redirecciona a /rental', async () => {
    const redirectMock = jest.fn();
    const savedRentalMock = { id: 1 };
    serviceMock.save.mockImplementationOnce(() => savedRentalMock);
    const bodyMock = new Rental({
        id: 0,
        carId: NaN,
        customerId: NaN,
        carPricePerDay: NaN,
        startDate: undefined,
        endDate: undefined,
        totalPrice: NaN,
        paymentType: undefined,
        isPaid: false,
        customer: {},
        car: {},
    });
    const req = { body: bodyMock, session: {} };

    await controller.save(req, { redirect: redirectMock });

    expect(serviceMock.save).toHaveBeenLastCalledWith(
        expect.objectContaining({
            id: bodyMock.id,
            carId: bodyMock.carId,
            customerId: bodyMock.customerId,
            car: bodyMock.car,
            customer: bodyMock.customer,
        })
    );
    expect(req.session.messages[0]).toEqual(
        `Added rental with id ${savedRentalMock.id} `
    );
    expect(redirectMock).toHaveBeenCalledWith('/rental');
});

test('Save llama al servicio con un body inexistente,carga error y redirecciona a /rental', async () => {
    const redirectMock = jest.fn();
    const bodyMock = undefined;
    const req = { body: bodyMock, session: { errors: {} } };
    serviceMock.save.mockImplementationOnce(() => {
        throw Error('error');
    });
    await controller.save(req, { redirect: redirectMock });

    expect(req.session.errors).not.toEqual([]);
    expect(redirectMock).toHaveBeenCalledTimes(1);
    expect(redirectMock).toHaveBeenCalledWith('/rental');
});

test('Delete llama al servicio con el id del body y redirecciona a /rental', async () => {
    const FAKE_RENTAL = new Rental({ id: 1 });
    serviceMock.getById.mockImplementationOnce(() =>
        Promise.resolve(FAKE_RENTAL)
    );
    const redirectMock = jest.fn();

    await controller.delete(
        { params: { id: 1 }, session: {} },
        { redirect: redirectMock }
    );

    expect(serviceMock.delete).toHaveBeenCalledTimes(1);
    expect(serviceMock.delete).toHaveBeenCalledWith(FAKE_RENTAL);
    expect(redirectMock).toHaveBeenCalledTimes(1);
    expect(redirectMock).toHaveBeenCalledWith('/rental');
});

test('Delete llama al servicio con id inexistente,carga error en session y redirecciona a /rental', async () => {
    serviceMock.getById.mockImplementationOnce(() => {
        throw Error('Rental Not Found');
    });
    const redirectMock = jest.fn();

    const req = { params: { id: null }, session: { errors: {} } };
    await controller.delete(req, { redirect: redirectMock });

    expect(serviceMock.delete).toHaveBeenCalledTimes(1);
    expect(redirectMock).toHaveBeenCalledTimes(1);
    expect(redirectMock).toHaveBeenCalledWith('/rental');
    expect(req.session.errors).not.toEqual([]);
});
