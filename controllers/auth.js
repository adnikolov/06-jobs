const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors/index')
// const bcrypt = require('bcryptjs') - this is set up in the model already



const register = async (req, res) =>{
    //check directly in the controller
    // const {name,email,password} = req.body
    // if(!name || !password || !email){
    //     throw new BadRequestError('Please provide name, email and password')
    // }
//create a new temporary user object for hashing pass
//below code is in the mongoose middleware now
// const {name, email, password} = req.body

// const salt = await bcrypt.genSalt(10)
// const hashedPassword = await bcrypt.hash(password, salt)

// const tempUser = {name, email,password:hashedPassword}

    const user = await User.create({...req.body})
    // const token = jwt.sign({iduserId:user._id,name:user.name },'jwtSecret',{expiresIn:'30d'})
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({user:{name:user.name},token})
}



const login = async (req, res) =>{
    const {email, password} = req.body

    if(!email || !password){
        throw new BadRequestError('Please provide email and password')
    }

    const user = await User.findOne({email})
    if(!user){
        throw new UnauthenticatedError('Invalid Credentials')
    }
    
    //compare password
    const isPasswordCorrect = await user.comparePassword(password)
  
    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid Password')
    }

const token = user.createJWT()
res.status(StatusCodes.OK).json({user:{name:user.name}, token})

}


module.exports = {register, login}


