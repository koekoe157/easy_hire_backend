import { Router } from "express";

const testRouter = Router();

testRouter.get('/', async(req, res) => {
    return res.status(200).json({
        message: "Welcome to the node server"
    })
})

export default testRouter;