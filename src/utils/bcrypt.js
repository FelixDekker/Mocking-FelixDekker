import bcrypt from 'bcrypt'

export const createHash = (password) => bcrypt.hashSync (password, bcrypt.genSaltSync (parseInt(15)))

export const validatePassword =  (passwordSend, passwordBDD) => bcrypt.compareSync(passwordSend, passwordBDD)