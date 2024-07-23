import BusinessService from '../models/businessModels.js';

const service = new BusinessService();

class businessDTO {
    constructor(data) {
        this.data = data;

        this.data.id = 1;
        this.data.products = [
            { id: 1, name: 'Medialuna x 12', price: 5000 },
            { id: 2, name: 'Bizcocho dulce x 12', price: 3000 },
            { id: 3, name: 'Pan francés x kg', price: 6000 }
        ];
    }
}

class BusinessController {
    constructor() {
    }

    async get(id) {
        try {
            return id === undefined || id === null ? await service.get(): await service.getOne(id);
        } catch (err) {
            return err.message
        }
        
    }

    async add(data) {
        try {
            const normalized = new businessDTO(data);
            return await service.add(normalized.data);
        } catch (err) {
            return err.message
        }
    }

    async update(id, data) {
        try {
            return await service.update(id, data);
        } catch (err) {
            return err.message
        }
    }

    async delete(id) {
        try {
            return await service.delete(id);
        } catch (err) {
            return err.message
        }
    }
}

export default BusinessController;