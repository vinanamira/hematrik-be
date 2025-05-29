require('dotenv').config();

const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key']; 

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(403).json({ message: 'Akses Ditolak: API Key Tidak Valid' });
  }
  next();
};

module.exports = authenticateApiKey;