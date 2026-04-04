const startTime = Date.now();

export const getHealth = (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: `${Math.floor((Date.now() - startTime) / 1000)}s`,
  });
};