const { fromModelToEntity } = require('../carMapper');
const CarEntity = require('../../entity/car');

test('Convierte un modelo a una entidad del dominio', () => {
    expect(
        fromModelToEntity({
            toJSON() {
                return {};
            },
        })
    ).toBeInstanceOf(CarEntity);
});
