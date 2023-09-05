const errorHandler = (error, res, customMessage = 'Error') => {
  if (!res) return null;
  const { status, data } = error?.response || {};
  return res.status(status ?? 500).json({ message: data?.message || customMessage });
};

module.exports = errorHandler;
