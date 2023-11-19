const Joi = require('joi');

module.exports.validateReq = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    const { error } = schema.validate(req.body);
    
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        res.status(400).send(msg);
    } else {
        next();
    }
}