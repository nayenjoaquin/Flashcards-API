import Joi from "joi";

export const DeckSchema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    description: Joi.string().optional(),
    visibility: Joi.string().valid('public', 'private', 'archived').default('private'),
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

export const ProgressSchema = Joi.object({
    card_id: Joi.string().guid().required(),
    user_id: Joi.string().guid().required(),
    i: Joi.number().integer().min(0).required(),
    n: Joi.number().integer().min(0).required(),
    ef: Joi.number().min(1.3).required(),
    due_date: Joi.date().required(),
}).required();

export const SessionSchema = Joi.object({
    deck_id: Joi.string().guid().required(),
    user_id: Joi.string().guid().required(),
    wrong: Joi.number().integer().min(0).required(),
    good: Joi.number().integer().min(0).required(),
    perfect: Joi.number().integer().min(0).required(),
    duration: Joi.number().integer().min(0).required()
})
