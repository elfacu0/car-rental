const { fromModelToEntity } = require('../customerMapper');
const customerEntity = require('../../entity/customer');

test('Convierte un modelo a una entidad del dominio', () => {
    expect(
        fromModelToEntity({
            toJSON() {
                return {};
            },
        })
    ).toBeInstanceOf(customerEntity);
});
