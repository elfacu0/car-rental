const CustomerController = require('../customerController');
const Customer = require('../../entity/customer');
const CustomerIdNotDefinedError = require('../error/customerIdNotDefinedError');

const serviceMock = {
    save: jest.fn(),
    delete: jest.fn(() => Promise.resolve(true)),
    getById: jest.fn(() => Promise.resolve({})),
    getAll: jest.fn(() => Promise.resolve([])),
};
const controller = new CustomerController(serviceMock);

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
    expect(renderMock).toHaveBeenCalledWith('customer/view/index.html', {
        data: { customers: [] },
        admin: true,
        errors: [],
        messages: [],
    });
});
test('Create renders form.html', async () => {
    const renderMock = jest.fn();
    await controller.create({}, { render: renderMock });

    expect(renderMock).toHaveBeenCalledTimes(1);
    expect(renderMock).toHaveBeenCalledWith('customer/view/form.html', {
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
    expect(renderMock).toHaveBeenCalledWith('customer/view/form.html', {
        data: { customer: {} },
    });
});

test('View NO renderea form.html con id invalido', async () => {
    const renderMock = jest.fn();
    const req = { params: { id: 0 }, session: { errors: [], messages: [] } };
    await expect(controller.view(req, { render: renderMock })).rejects.toThrow(
        CustomerIdNotDefinedError
    );
    expect(renderMock).not.toHaveBeenCalledWith('customer/view/form.html', {
        data: { customer: {} },
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
    expect(renderMock).not.toHaveBeenCalledWith('customer/view/form.html', {
        data: { customer: {} },
    });
    expect(redirectMock).toHaveBeenCalledTimes(1);
});

test('Save llama al servicio con el body y redirecciona a /customer', async () => {
    const redirectMock = jest.fn();
    const bodyMock = new Customer({
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
    });

    await controller.save(
        { body: bodyMock, session: {} },
        { redirect: redirectMock }
    );

    expect(serviceMock.save).toHaveBeenCalledTimes(1);
    expect(serviceMock.save).toHaveBeenCalledWith(bodyMock);
    expect(redirectMock).toHaveBeenCalledTimes(1);
    expect(redirectMock).toHaveBeenCalledWith('/customer');
});

test('Save llama al servicio con customer nuevo y redirecciona a /customer', async () => {
    const redirectMock = jest.fn();
    const bodyMock = new Customer({
        id: NaN,
        firstNames: undefined,
        lastNames: undefined,
        documentType: undefined,
        documentNumber: undefined,
        nationality: undefined,
        address: undefined,
        phone: undefined,
        email: undefined,
        birthDate: undefined,
    });

    const req = { body: {}, session: {} };
    await controller.save(req, { redirect: redirectMock });

    expect(serviceMock.save).toHaveBeenCalledWith(bodyMock);
    expect(req.session.errors).not.toEqual([]);
    expect(req.session.messages).not.toEqual([]);
    expect(redirectMock).toHaveBeenCalledTimes(1);
    expect(redirectMock).toHaveBeenCalledWith('/customer');
});

test('Save llama al servicio carga un error y redirecciona a /customer', async () => {
    const redirectMock = jest.fn();
    serviceMock.save.mockImplementationOnce(() => {
        throw Error('Error');
    });
    const req = { body: {}, session: {} };
    await controller.save(req, { redirect: redirectMock });

    expect(req.session.errors).not.toEqual([]);
    expect(req.session.messages).toEqual();
    expect(redirectMock).toHaveBeenCalledTimes(1);
    expect(redirectMock).toHaveBeenCalledWith('/customer');
});

test('Delete llama al servicio con el id del body y redirecciona a /customer', async () => {
    const FAKE_CUSTOMER = new Customer({ id: 1 });
    serviceMock.getById.mockImplementationOnce(() =>
        Promise.resolve(FAKE_CUSTOMER)
    );
    const redirectMock = jest.fn();

    await controller.delete(
        { params: { id: 1 }, session: {} },
        { redirect: redirectMock }
    );

    expect(serviceMock.delete).toHaveBeenCalledTimes(1);
    expect(serviceMock.delete).toHaveBeenCalledWith(FAKE_CUSTOMER);
    expect(redirectMock).toHaveBeenCalledTimes(1);
    expect(redirectMock).toHaveBeenCalledWith('/customer');
});

test('Delete llama al servicio, recibe un error,lo carga y  redirecciona a /customer', async () => {
    const FAKE_CUSTOMER = new Customer({ id: 1 });
    serviceMock.delete.mockImplementationOnce(() => {
        throw Error('error');
    });
    const redirectMock = jest.fn();
    const req = { params: { id: 1 }, session: {} };

    await controller.delete(req, { redirect: redirectMock });

    expect(serviceMock.delete).toHaveBeenCalledTimes(2);
    expect(serviceMock.delete).toHaveBeenCalledWith(FAKE_CUSTOMER);
    expect(req.session.errors).not.toEqual([]);
    expect(redirectMock).toHaveBeenCalledTimes(1);
    expect(redirectMock).toHaveBeenCalledWith('/customer');
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
    expect(redirectMock).toHaveBeenCalledWith('/customer');
});
