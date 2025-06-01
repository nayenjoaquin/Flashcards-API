import Joi from "joi";

export const deckSchema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    description: Joi.string().optional(),
    visibility: Joi.string().valid('public', 'private', 'archived').default('private'),
    user_id: Joi.string().guid().required()
}).required();
export const deckUpdateSchema = Joi.object({
    name: Joi.string().min(1).max(255).optional(),
    description: Joi.string().optional(),
    visibility: Joi.string().valid('public', 'private', 'archived').optional(),
}).required();
export const deckIdSchema = Joi.string().guid().required();