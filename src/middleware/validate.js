const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Invalid value");
    error.statusCode = 422;
    error.message = errors.array();
    throw error;
  }
  next();
};
