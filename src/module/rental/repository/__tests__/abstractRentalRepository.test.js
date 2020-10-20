const AbstractRentalRepository = require('../abstractRentalRepository');
const AbstractRentalRepositoryError = require('../error/abstractRentalRepositoryError');

test('No se puede instanciar un repositorio abstracto', () => {
    let repoInstance;
    try {
        repoInstance = new AbstractRentalRepository();
    } catch (e) {
        expect(e).toBeInstanceOf(AbstractRentalRepositoryError);
    } finally {
        expect(repoInstance).toBeUndefined();
    }
});

test('Se puede instanciar un repositorio concreto que herede del repositorio abstracto', () => {
    const ConcreteRepository = class extends AbstractRentalRepository {};
    const respositoryInstance = new ConcreteRepository();
    expect(respositoryInstance).toBeInstanceOf(ConcreteRepository);
    expect(respositoryInstance).toBeInstanceOf(AbstractRentalRepository);
});
