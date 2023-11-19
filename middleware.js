const Joi = require('joi');

module.exports.validateReq = (req, res, next) => {
    const schema = Joi.object({
        code: Joi.string().min(5).required(),
        name: Joi.string().min(5).required(),
        description: Joi.string()
    });

    const { error } = schema.validate(req.body);
    
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        res.status(400).send(msg);
    } else {
        next();
    }
}