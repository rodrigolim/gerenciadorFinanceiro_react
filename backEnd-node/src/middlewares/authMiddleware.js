import jwt from 'jsonwebtoken'

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization  

  try {

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw new Error('Authentication Invalid')
    }
  
    const token = authHeader.split(' ')[1]

    const JWT_SECRET = process.env.JWT_SECRET || "palavraSecreta"
    const payload = jwt.verify(token, JWT_SECRET)

    req.user = { userId: payload.userId }

    next()
  } catch (error) {
    res.status(401).json({ message: 'Algo deu errado => '+error })
  }
}

export default authMiddleware
