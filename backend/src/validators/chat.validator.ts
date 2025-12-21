import Joi from 'joi';

const createChatSchema = Joi.object({
    email: Joi.string().email().trim().lowercase().required().messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required',
        'any.required': 'Email is required',
    }),
});

const createGroupChatSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        'string.empty': 'Group name is required',
        'any.required': 'Group name is required',
    }),
    users: Joi.array()
        .items(Joi.string().email().required())
        // .min(2)
        .unique()
        .required()
        .messages({
            'array.base': 'Users must be an array of emails',
            'array.min': 'More than 2 users are required to form a group chat',
            'any.required': 'Users list is required',
        }),
});

const chatValidation = {
    createChatSchema,
    createGroupChatSchema,
};

export default chatValidation;
