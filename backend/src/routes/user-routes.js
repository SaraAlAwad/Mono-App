const express = require("express")
const multer = require("multer")
const { doAuthMiddleware } = require("../auth/doAuthMiddleware")
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
//pictureUploadMiddleWare is need it here
userRouter.post("/register", async (req, res) => {
    try {
        const userInfo = req.body
        const user = await UserService.registerUser(userInfo)
        console.log("userInfo", userInfo);
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
            email: req.body.email,
            password: req.body.password
        })

        if (result.refreshToken) {
            req.session.refreshToken = result.refreshToken
        }
        console.log("result", result);
        res.status(200).json(result)
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: { message: err ? err.message : "Unknown error while logging in." } })
    }
})

userRouter.get("/show-wallet",
    doAuthMiddleware,
    async (req, res) => {
        try {
            const userId = req.userClaims.sub
            const userWallet = await UserService.showWallet({ userId })
            res.status(200).json(userWallet)
        } catch (err) {
            res.status(500).json({ err: { message: err ? err.message : "User not found..." } })
        }
    }
)
userRouter.get("/show-wallet-in-period",
    doAuthMiddleware,
    async (req, res) => {
        try {
            const userId = req.userClaims.sub
            const startEndTimeStamps = req.body.startEndTimeStamps
            const userWallet = await UserService.ShowTransactionsInPeriod({ userId, startEndTimeStamps })
            res.status(200).json(userWallet)
        } catch (err) {
            res.status(500).json({ err: { message: err ? err.message : "User not found..." } })
        }
    }
)

userRouter.post("/refreshtoken", async (req, res) => {
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
