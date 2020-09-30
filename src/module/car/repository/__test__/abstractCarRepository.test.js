const AbstractCarRepository = require('../abstractCarRepository');
const AbstractCarRepositoryError = require('../error/abstractCarRepositoryError');

test('No se puede instanciar un repositorio abstracto', () => {
    let repoInstance;
    try {
        repoInstance = new AbstractCarRepository();
    } catch (e) {
        expect(e).toBeInstanceOf(AbstractCarRepositoryError);
    } finally {
        expect(repoInstance).toBeUndefined();
    }
});

test('Se puede instanciar un repositorio concreto que herede del repositorio abstracto', () => {
    const ConcreteRepository = class extends AbstractCarRepository {};
    const respositoryInstance = new ConcreteRepository();
    expect(respositoryInstance).toBeInstanceOf(ConcreteRepository);
    expect(respositoryInstance).toBeInstanceOf(AbstractCarRepository);
});
