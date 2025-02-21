import bcryptjs from 'bcryptjs'

/**codifica a senha  */
export const hashPassword = (password) => 
    bcryptjs.hashSync(password)

    /**retorna verdadeiro ou falso se a senha existe no banco de dados */
export const comparePassword = (password, hash) => 
    bcryptjs.compareSync(password, hash)