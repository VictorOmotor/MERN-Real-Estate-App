export function globalErrorHandler(err, req, res, next) {
  // Instance of errors

  console.log(err.name)
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      // message: err.details[0].message,
      // status: "Failed",
      // errorType: "ValidationError"
      message: err.message,
    })
  }

  return res.status(err.status || 404).json({
    message: err.message,
    status: 'Failed',
  })
}
