function validateMovie(req, res, next) {
  const { year, title, studios, producers, winner } = req.body;
  const currentYear = new Date().getFullYear();

  if (
    typeof year !== 'number' ||
    !Number.isInteger(year) ||
    year < 1900 ||
    year > currentYear
  ) {
    return res.status(400).json({ message: "Ano inválido" });
  }

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ message: "Título inválido" });
  }

  if (!studios || typeof studios !== 'string') {
    return res.status(400).json({ message: "Estúdio inválido" });
  }

  if (!producers || typeof producers !== 'string') {
    return res.status(400).json({ message: "Produtor inválido" });
  }

  if (
    winner !== undefined &&
    winner !== null &&
    winner !== '' &&
    winner !== 'yes'
  ) {
    return res.status(400).json({ message: "Winner deve ser 'yes', vazio ou nulo" });
  }

  next();
}

module.exports = validateMovie;