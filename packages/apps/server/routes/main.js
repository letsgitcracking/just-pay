'use strict';
const express = require('express');
const router = express.Router();
const RippleAPI = require('ripple-lib').RippleAPI;
const SendMoney = require('../api/send-xrp');

router.get('/', getCredientials, (req, res, next) => {
    res.json(`Welcome address ${res.userAddress}`);
    console.log(`Welcome address ${res.userAddress}`)
    res.status(200);
    res.end();
});

router.get('/ripple', getCredientials, (req, res, next) => {
    const api = new RippleAPI({
        // server: 'wss://s1.ripple.com' // Public rippled server
        server: 'wss://s.altnet.rippletest.net:51233' // Testnet rippled server
    });
    const rippleAddress = res.userAddress;
    api.connect().then(() => {
        /* begin custom code ------------------------------------ */
        console.log(`Retrieving info of Account: ${rippleAddress}`);
        return api.getAccountInfo(rippleAddress);
    }).then(info => {
        console.log(info);
        console.log('Retrieval successful.');
        res.json(info);
        /* end custom code -------------------------------------- */
    }).then(() => {
        return api.disconnect();
    }).then(() => {
        console.log('Successfuly disconnected.');
    }).catch((err) => {
        console.log(err);
        next();
    });
});

router.get('/send', (req, res, next) => {
    SendMoney();
    res.end();
});

function userAddress(req, res, next) {
    res.userAddress = 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn';
    next();
};

function getCredientials(req, res, next) {
    res.userAddress = process.env.testAddress1;
    res.secretKey = process.env.testAddress1Secret;
    next();
}

module.exports = router;