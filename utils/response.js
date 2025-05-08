exports.responseToUser = (success, status, message, data) => {
  return {
    success: success,
    status: status,
    message: message,
    data,
  };
};

exports.serverError = () => {
  return {
    success: false,
    message: "Oops!! Sorry, Server is down",
  };
};
