import Joi from "joi";

export const DeckSchema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    description: Joi.string().optional(),
    visibility: Joi.string().valid('public', 'private', 'archived').default('private'),
    user_id: Joi.string().guid().required()
}).required();
export const DeckUpdateSchema = Joi.object({
    name: Joi.string().min(1).max(255).optional(),
    description: Joi.string().optional(),
    visibility: Joi.string().valid('public', 'private', 'archived').optional(),
}).required();
export const uuidSchema = Joi.string().guid().required();

export const CardSchema = Joi.object({
    front: Joi.string().required(),
    back: Joi.string().required(),
    deck_id: Joi.string().guid().required()

})

export const UserSchema = Joi.object({
    username : Joi.string().max(50).required(),
    email : Joi.string().max(255).required(),
    password :Joi.string().max(255).required()
}).required();