import BusinessService from '../models/businessModels.js';

const service = new BusinessService();

class businessDTO {
    constructor(data) {
        this.id = data.id || null;
        this.name = data.name || '';
        this.products = data.products || [];
    }
}

class BusinessController {
    constructor() {}

    async get(id) {
        try {
            return id ? await service.getOne(id) : await service.get();
        } catch (err) {
            throw new Error(`Error al obtener datos: ${err.message}`);
        }
    }

    async add(data) {
        try {
            const normalized = new businessDTO(data);
            return await service.add(normalized);
        } catch (err) {
            throw new Error(`Error al agregar negocio: ${err.message}`);
        }
    }

    async update(id, data) {
        try {
            return await service.update(id, data);
        } catch (err) {
            throw new Error(`Error al actualizar negocio: ${err.message}`);
        }
    }

    async delete(id) {
        try {
            return await service.delete(id);
        } catch (err) {
            throw new Error(`Error al eliminar negocio: ${err.message}`);
        }
    }
}

export default BusinessController;
