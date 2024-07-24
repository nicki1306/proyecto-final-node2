import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.status(200).send({ status: "OK", data: req.session });
});

router.get("/complex", (req, res) => {
    const child = fork("./complex.js");
    child.send("start");
    child.on("message", (result) => {
        res.status(200).send({
            origin: config.SERVER,
            payload: "Se ha procesado el proceso complejo",
            result: result,
        });
    });
});

router.post("/login", (req, res) => {
    req.session.user = req.body;
    res.status(200).send({ status: "OK", data: req.session });
});

router.post("/logout", (req, res) => {
    req.session.destroy();
    res.status(200).send({ status: "OK", data: req.session });
});

export default router;