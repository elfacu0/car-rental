const Rental = require('../../rental/entity/rental');
module.exports = class Customer {
    constructor({
        id,
        firstNames,
        lastNames,
        documentType,
        documentNumber,
        nationality,
        address,
        phone,
        email,
        birthDate,
        isDeleted,
        rentals,
    }) {
        let mappedRentals = [];
        if (rentals) {
            mappedRentals = rentals.map((rental) => new Rental(rental));
        }
        this.id = Number(id);
        this.firstNames = firstNames;
        this.lastNames = lastNames;
        this.documentType = documentType;
        this.documentNumber = documentNumber;
        this.nationality = nationality;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.birthDate = birthDate;
        this.isDeleted = isDeleted;
        this.rentals = mappedRentals;
    }
};
