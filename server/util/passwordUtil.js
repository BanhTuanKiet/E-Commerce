import bcrypt from "bcrypt"

const saltRounds = 10

export const hashPassword = async (plainPassword) => {
    const salt = await bcrypt.genSalt(saltRounds)
    return await bcrypt.hash(plainPassword, salt)
}

export const comparePassword = async (plainPassword, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword)
        return isMatch
    } catch (error) {
        
    }
}