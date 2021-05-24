exports.throwError = (errorMessage, statusCode, error) => {
  if (error) throw error;
  const genError = new Error(errorMessage);
  genError.statusCode = Number(statusCode) || 500;
  throw genError;
};
