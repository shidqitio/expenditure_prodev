module.exports = (error, req, res, next) => {
  const code = error.statusCode || 500;

  let data = {
    code: code,
    status: "Failed",
    error: error.message,
  };

  if (code !== 422) {
    data = {
      code: code,
      status: "Failed",
      error: [
        {
          msg: error.message,
        },
      ],
    };
  }

  res.json(data);
};
