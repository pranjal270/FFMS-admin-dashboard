const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateRecoveryCodes = require("../utils/generateRecoveryCodes");

exports.register = async (req,res)=>{

  const {email,password,role} = req.body; //destructuring

  const hashedPassword = await bcrypt.hash(password,10)

  const user = new User({                      // model 
    email,                                     //email = email shortcut
    password: hashedPassword,
    role
  })

  await user.save()

  res.json({message:"User created"})
}


exports.login = async (req,res)=>{

  const {email,password} = req.body

  const user = await User.findOne({email})

  if(!user){
    return res.status(400).json({message:"User not found"})
  }

  const match = await bcrypt.compare(password,user.password)

  if(!match){
    return res.status(400).json({message:"Invalid password"})
  }

  let recoveryCodes = null

  if(!user.recoveryCodesShown){

    recoveryCodes = generateRecoveryCodes()

    user.recoveryCodes = recoveryCodes;
    user.recoveryCodesShown = true;

    await user.save()

  }

  const token = jwt.sign(
    {id:user._id, role:user.role},
    process.env.JWT_SECRET
  );

  res.json({
    token,
    recoveryCodes
  });

};