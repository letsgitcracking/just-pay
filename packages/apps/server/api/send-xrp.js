const axios = require('axios');
const RippleAPI = require('ripple-lib').RippleAPI; // For Node.js. In browsers, use <script>.

// Example credentials
// let address = "rMCcNuTcajgw7YTgBy1sys3b89QqjUrMpH"
// let secret = "sn3nxiW7v8KXzPzAqzyHXbSSKNuN9"

module.exports = (req, res, next) => {
    // Connect ---------------------------------------------------------------------
    api = new RippleAPI({ server: 'wss://s.altnet.rippletest.net:51233' });
    api.connect();
    api.on('connected', async () => {

        // Get credentials from the Testnet Faucet -----------------------------------
        // This doesn't technically need to happen after you call api.connect() but
        // it's convenient to do here because we can use await on the faucet call and
        // to wait for the new account to be funded.
        try {
            const response = await axios.post('https://faucet.altnet.rippletest.net/accounts');
            address = response.data.account.address;
            secret = response.data.account.secret;
            console.log("Waiting until we have a validated starting sequence number...");
        } catch (error) {
            console.log(`Faucet returned an error: ${error}`);
        };
        // If you go too soon, the funding transaction might slip back a ledger and
        // then your starting Sequence number will be off. This is mostly relevant
        // when you want to use a Testnet account right after getting a reply from
        // the faucet.
        while (true) {
            try {
                await api.request("account_info", { account: address, ledger_index: "validated" })
                break
            } catch (e) {
                await new Promise(resolve => setTimeout(resolve, 1000))
            }
        };

        // Prepare transaction -------------------------------------------------------
        const preparedTx = await api.prepareTransaction({
            "TransactionType": "Payment",
            "Account": address,
            "Amount": api.xrpToDrops("980"), // Same as "Amount": "22000000"
            // "Amount": "999900000", // Same as "Amount": "22000000"
            "Destination": "rvH1sqQzx1Lp3fTh2TUWbaZge6BToLbgy"
        }, {
            // Expire this transaction if it doesn't execute within ~5 minutes:
            "maxLedgerVersionOffset": 75
        })
        const maxLedgerVersion = preparedTx.instructions.maxLedgerVersion;
        console.log("Prepared transaction instructions:", preparedTx.txJSON);
        console.log("Transaction cost:", preparedTx.instructions.fee, "XRP");
        console.log("Transaction expires after ledger:", maxLedgerVersion);

        // Sign prepared instructions ------------------------------------------------
        const signed = api.sign(preparedTx.txJSON, secret);
        const txID = signed.id;
        const tx_blob = signed.signedTransaction;
        console.log("Identifying hash:", txID);
        console.log("Signed blob:", tx_blob);

        // Submit signed blob --------------------------------------------------------
        // The earliest ledger a transaction could appear in is the first ledger
        // after the one that's already validated at the time it's *first* submitted.
        const earliestLedgerVersion = (await api.getLedgerVersion()) + 1;
        const result = await api.submit(tx_blob);
        console.log("Tentative result code:", result.resultCode);
        console.log("Tentative result message:", result.resultMessage);

        // Wait for validation -------------------------------------------------------
        let has_final_status = false;
        api.request("subscribe", { accounts: [address] })
        api.connection.on("transaction", (event) => {
            if (event.transaction.hash == txID) {
                console.log("Transaction has executed!", event)
                has_final_status = true
            }
        });
        api.on('ledger', ledger => {
            if (ledger.ledgerVersion > maxLedgerVersion && !has_final_status) {
                console.log("Ledger version", ledger.ledgerVersion, "was validated.")
                console.log("If the transaction hasn't succeeded by now, it's expired")
                has_final_status = true
            }
        });

        // There are other ways to do this, but they're more complicated.
        // See https://xrpl.org/reliable-transaction-submission.html for details.
        while (!has_final_status) {
            await new Promise(resolve => setTimeout(resolve, 1000))
        }

        // Check transaction results -------------------------------------------------
        try {
            tx = await api.getTransaction(txID, {
                minLedgerVersion: earliestLedgerVersion
            })
            console.log("Transaction result:", tx.outcome.result)
            console.log("Balance changes:", JSON.stringify(tx.outcome.balanceChanges))
        } catch (error) {
            console.log("Couldn't get transaction outcome:", error)
        }

    }) // End of api.on.('connected')
}