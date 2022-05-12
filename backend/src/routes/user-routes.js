const express = require("express")
const multer = require("multer")
const { UserService } = require("../use-cases")
const { imageBufferToBase64 } = require("../utils/hash")

const pictureUploadMiddleware = multer().single("avatar")
const userRouter = express.Router()


userRouter.get("/allUsers", async (_, res) => {
    try {
        const allUsers = await UserService.listAllUsers()
        res.status(200).json(allUsers)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: { message: error ? error.message : "Unknown error while loading all users." } })
    }
})
userRouter.post("/register", async (req, res) => {
    try {
        const userInfo = req.body
        console.log(userInfo);
        const user = await UserService.registerUser(userInfo)
        res.status(201).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({ err: error.message || "Unknown error while registering new user." })

    }
}
)
userRouter.post("/login", async (req, res) => {
    try {
        const result = await UserService.loginUser({
            userName: req.body.userName,
            password: req.body.password
        })
        if (result.refreshToken) {
            req.session.refreshToken = result.refreshToken
        }

        res.status(200).json(result)
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: { message: err ? err.message : "Unknown error while logging in." } })
    }
})
// i just copy that muss weiter bearbeitet
userRouter.post("/refreshtoken",
    // body("refreshToken").isLength({ min: 10 }), // nur wenn wir keine cookie-session verwenden, dann MUSS der refreshToken im body sein...
    // doValidations,
    async (req, res) => {
        try {
            const result = await UserService.refreshUserToken({
                refreshToken: req.session.refreshToken || req.body.refreshToken
            })
            res.status(200).json(result)
        } catch (err) {
            res.status(500).json({ err: { message: err ? err.message : "Unknown error while refreshing your token." } })
        }
    }
)
module.exports = {
    userRouter
}