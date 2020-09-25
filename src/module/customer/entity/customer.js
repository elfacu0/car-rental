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
    }) {
        this.id = id;
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
    }
};
