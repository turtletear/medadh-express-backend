const response_generator = (statusCode, result, res) => {
  res.statusCode = statusCode;
  res.json(result);
};

const result_controller = (response, result) => {
  return {
    status: response,
    data: result,
  };
};

module.exports = {
  response_generator,
  result_controller,
};
