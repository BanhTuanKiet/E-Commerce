import usersModel from "../model/usersModel.js"

export const createUser = async (user) => {
    return await usersModel.create(JSON.parse(JSON.stringify(user)))
}