const AbstractCustomerRepository = require('../abstractCustomerRepository');
const AbstractCustomerRepositoryError = require('../error/abstractCustomerRepositoryError');

test('No se puede instanciar un repositorio abstracto', () => {
    let repoInstance;
    try {
        repoInstance = new AbstractCustomerRepository();
    } catch (e) {
        expect(e).toBeInstanceOf(AbstractCustomerRepositoryError);
    } finally {
        expect(repoInstance).toBeUndefined();
    }
});

test('Se puede instanciar un repositorio concreto que herede del repositorio abstracto', () => {
    const ConcreteRepository = class extends AbstractCustomerRepository {};
    const respositoryInstance = new ConcreteRepository();
    expect(respositoryInstance).toBeInstanceOf(ConcreteRepository);
    expect(respositoryInstance).toBeInstanceOf(AbstractCustomerRepository);
});
