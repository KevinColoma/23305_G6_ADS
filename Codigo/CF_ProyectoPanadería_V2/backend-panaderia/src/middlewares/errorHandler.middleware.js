function errorHandler(err, _, res, __) {
  console.error(err);
  res.status(500).json({ error: err.message });
}
module.exports = errorHandler;
