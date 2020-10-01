const CustomerController = require('../customerController');
const Customer = require('../../entity/customer');

const serviceMock = {
    save: jest.fn(),
    delete: jest.fn(() => Promise.resolve(true)),
    getById: jest.fn(() => Promise.resolve({})),
    getAll: jest.fn(() => Promise.resolve([])),
};
const controller = new CustomerController(serviceMock);

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
