const clientError = (req, res, message) => res.status(400).json({ message });

const notFoundError = (req, res, message) => res.status(404).json({ message });

const unauthorizedError = (req, res, message) =>
  res.status(401).json({ message });

export default { clientError, notFoundError, unauthorizedError };
