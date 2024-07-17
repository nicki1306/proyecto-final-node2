import { fork } from 'child_process';
import {Router} from 'express';
import config from '../config';

const router = Router();

const listNumbers = (...numbers) => {
    numbers.forEach((number) => {
        if (isNaN(number)) {
            throw new Error('Not a number');
            process.exit(-4);
        }else {
            console.log(number);}
    });
};


const complex = () => {
    let result = 0;
    for (let i = 0; i <= 3e9; i++ ) result += i // 3 000 000 000
    return result;
};


router.get('/', (req, res) => {
    res.status(200).send({
        origin: config.SERVER,
        payload: 'Servidor en ejecución ${process.uptime().tofixed(2)}'})
});

router.get('/listNumbers', async (req, res) => {
    listNumbers(req.query.num1, req.query.num2, req.query.num3);
    res.status(200).send({
        origin: config.SERVER,
        payload: 'Se han procesado los 3 números'})
});

router.get('/complex', async (req, res) => {
    const child = fork('./complex.js');
    child.send('start');
    child.on('message', (result) => {
        res.status(200).send({
            origin: config.SERVER,
            payload: 'Se ha procesado el proceso complejo', 
            result: result

        })
    })

});


export default router;