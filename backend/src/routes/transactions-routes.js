const express = require("express")
const multer = require("multer")

const { TransactionService } = require("../use-cases")
const { imageBufferToBase64 } = require("../utils/hash")
const { doAuthMiddleware } = require("../auth/doAuthMiddleware")

const transactionsRouter = express.Router()
const upload = multer()
const pictureUploadMiddleware = upload.single("image")

transactionsRouter.post("/add",
    pictureUploadMiddleware,
    doAuthMiddleware,
    async (req, res) => {
        try {
            const created_atTimeStamp = new Date(req.body.created_at).getTime()
            console.log("created_atTimeStamp: ", created_atTimeStamp);
            let image;

            if (req.file === undefined) {
                image = "https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"
            } else {
                image = imageBufferToBase64(req.file.buffer, req.file.mimetype)
            }
            console.log("req.file.buffer", req.file);
            const result = await TransactionService.addTransaction({
                name: req.body.name,
                income: req.body.income === "false" ? false : true,
                amount: Number(req.body.amount),
                created_at: created_atTimeStamp,
                image: image,
                userId: req.userClaims.sub
            })

            res.status(201).json(result)
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: { message: err ? err.message : "Unknown error while adding a new transaction" } })
        }
    }

)

transactionsRouter.get("/:transactionId", doAuthMiddleware, async (req, res) => {
    try {
        const transactionId = req.params.transactionId
        const result = await TransactionService.showTransaction({ transactionId })
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: { message: error ? error.message : "Unknown error while loading post." } })
    }
})

// edit transaction route 
transactionsRouter.put("/edit", doAuthMiddleware, async (req, res) => {
    try {
        // const transactionId = req.params.transactionId
        const transactioUpdateInfo = req.body
        console.log("transactioUpdateInfo", transactioUpdateInfo);
        // console.log("transactionId", transactionId);

        const updatedTransaction = await TransactionService.editTransaction(transactioUpdateInfo)

        console.log("updatedTransaction", updatedTransaction);

        res.json(updatedTransaction)
    } catch (error) {
        console.log(error);
        res.status(500).json("Unknown error while editing a Transaction.")
    }
})

module.exports = { transactionsRouter }