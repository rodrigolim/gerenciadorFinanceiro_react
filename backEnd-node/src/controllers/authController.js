import User from '../models/User.js'

const register = async (req, res) => {
  const { name, email, password } = req.body


  try {


    if (!name) {
      throw new Error('Para Registrar é obrigatorio informar a propriedade name')
    }

    if (!email) {
      throw new Error('Para Registrar é obrigatorio informar a propriedade email')
    }

    if (!password) {
      throw new Error('Para Registrar é obrigatorio informar a propriedade password')
    }

    const userAlreadyExists = await User.findOne({ email })

    if (userAlreadyExists) {
      throw new Error('Usuário já existe')
    }

    const user = await User.create({ name, email, password }) 

    const token = user.createJWT()

    res.status(201).json({
      user: {
        name: user.name,
        email: user.email
      },
      token
    })
  } catch (error) {
    res.status(500).json({ message: 'Algo deu errado no processo de register => '+error })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body

  

  try {
    if (!email) {
      throw new Error('Para Login é obrigatorio informar o EMAIL.')
    }

    if (!password) {
      throw new Error('Para Login é obrigatorio informar o PASSWORD.')
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return res.status(404).json({ message: 'Usuário não existe!' })
    }

    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Credenciais inválidas!' })
    }

    const token = user.createJWT()

    res.status(200).json({
      user: {
        email: user.email,
        name: user.name
      },
      token
    })
    
  } catch (error) {
    res.status(500).json({ message: 'Algo deu errado no processo de Login => '+error })
  }
}

const updateUser = async (req, res) => {
  const { email, name } = req.body

  try {
    if (!email || !name) {
      throw new Error('Forneça todos os valores')
    }

    const user = await User.findOne({ _id: req.user.userId })

    user.email = email
    user.name = name

    await user.save()

    const token = user.createJWT()

    res.status(200).json({ user: { name, email }, token })
  } catch (error) {
    // res.status(500).json({ message: error })
    console.log(error)
  }
}

export { register, login, updateUser }
