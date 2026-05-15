export class BaseController {
    constructor(service) {
        this.service = service;
    }

    getAll = async (req, res, next) => {
        try {
            const query = req.validatedQuery ?? req.query;
            const result = await this.service.getAll(query);

            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    getById = async (req, res, next) => {
        try {
            const id = req.validatedParams?.id ?? req.params.id;
            const result = await this.service.getById(id);

            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    create = async (req, res, next) => {
        try {
            const payload = req.validated ?? req.body;
            const result = await this.service.create(payload);

            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            const payload = req.validated ?? req.body;
            const id = req.validatedParams?.id ?? req.params.id;
            const result = await this.service.update(id, payload);

            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req, res, next) => {
        try {
            const id = req.validatedParams?.id ?? req.params.id;
            await this.service.delete(id);

            res.json({
                success: true,
            });
        } catch (error) {
            next(error);
        }
    };
}
