const { UserDAO } = require("../db-access");
const { makeUser } = require("../domain/User");
const { createRandomSalt, createPasswordHash } = require("../utils/hash");


// i have to add profile picture
async function registerUser({ userName, email, password, avatar }) {
    const foundUser = await UserDAO.findUserByEmail(email)
    if (foundUser) {
        throw new Error("User with this email already exists.")
    }
    const passwordSalt = createRandomSalt()
    const passwordHash = createPasswordHash(password, passwordSalt)

    const user = makeUser({ userName, email, passwordHash, passwordSalt, avatar })
    const insertResult = await UserDAO.insertUser(user)
    return insertResult

}
module.exports = { registerUser }


