import { BaseController } from '../../../shared/core/BaseController.js';
import { ForbiddenError } from '../../../shared/core/errors.js';

export class UserController extends BaseController {
    constructor(service) {
        super(service);
    }

    getById = async (req, res, next) => {
        try {
            const actor = req.user;
            const id = req.validatedParams?.id ?? req.params.id;

            const isAdmin =
                actor?.role?.name === 'ADMIN' || actor?.role === 'ADMIN';
            const isSelf = actor?.id === id;

            if (!isAdmin && !isSelf) {
                throw new ForbiddenError(
                    'You can only access your own profile',
                );
            }

            const result = await this.service.getById(id);

            res.json(result);
        } catch (error) {
            next(error);
        }
    };
}
