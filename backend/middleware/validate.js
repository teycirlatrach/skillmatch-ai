export function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      res.status(400);
      return next(new Error(error.details.map(d => d.message).join(" | ")));
    }
    req.body = value;
    next();
  };
}
