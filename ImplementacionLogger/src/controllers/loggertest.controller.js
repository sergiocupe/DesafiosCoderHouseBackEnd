export const checkLoggers = async (req, res) => {
  try {
    req.logger.debug("Este es un log de prueba Debug")
    req.logger.http("Este es un log de prueba Http")
    req.logger.info("Este es un log de prueba Info")
    req.logger.warning("Este es un log de prueba Warining")
    req.logger.error("Este es un log de prueba Error")
    req.logger.fatal("Este es un log de prueba fatal")
    return res.status(200).send({ satus: "success" })
  } catch (err) {
    res.status(400).send({ message: err })
  }
}
