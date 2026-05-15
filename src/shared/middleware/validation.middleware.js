import { ZodError } from 'zod';

const formatZodIssues = (issues, source) => {
    return issues.map((issue) => ({
        field: issue.path.length > 0 ? issue.path.join('.') : source,
        message: issue.message,
        code: issue.code,
    }));
};

export const validateDto = (schema, source = 'body') => {
    return async (req, res, next) => {
        try {
            const payload = req[source];
            const validated = await schema.parseAsync(payload);

            if (source === 'body') {
                req.validated = validated;
            }

            if (source === 'query') {
                req.validatedQuery = validated;
            }

            if (source === 'params') {
                req.validatedParams = validated;
            }

            next();
        } catch (error) {
            if (!(error instanceof ZodError)) {
                return next(error);
            }

            const errors = formatZodIssues(error.issues, source);

            res.status(400).json({
                message: 'Validation failed',
                errors,
            });
        }
    };
};
