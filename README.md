# Examination System using Hyperledger-fabric
This repository contains chaincode, test-network and API made to work as a backend for examination system project whose frontend can be found [here](https://github.com/cyproto/examination-system_frontend "here").

Currently, the file structure is same as [fabric-samples](https://github.com/hyperledger/fabric-samples "fabric-samples") provided by hyperledger. 
- The chaincode is written with reference of fabcar example.
-  APIs are written in Node.js.
- And for network test-network is being used.

## Getting started

Make sure that you have [setup your environment](https://hyperledger-fabric.readthedocs.io/en/release-2.0/dev-setup/devenv.html "setup your environment") and are done with all the [prerequisites](https://hyperledger-fabric.readthedocs.io/en/release-2.0/prereqs.html "prerequisites").

**Versions:**
- **fabric:** 2.1.0
- **golang:** go1.14.1
- **node:** v10.15.2
- **npm:** 5.8.0

Now, just run the following command to clone and pull all the binaries and dockers images. No need to clone this repository manually, it'll all be done by the script.
```bash
curl -sSL abc
```

## Start fabric network:
After running this you will have to start the network and deploy the chaincode on it. For that just 
```bash
cd exam_result
sudo ./startNetwork.sh
```

Now, enroll admin and register user by doing 
```bash
cd javascript
node enrollAdmin.js
node registerUser.js
```

If everything goes as expected the chaincode will be deployed on channel `mychannel` and fabric network will be up and running.

## API:
Now heading towards the API, run
```bash
node app.js
```
which will start a node server on `localhost:8080`.

- There are 2 apis namely `getResult`  which will fetch result from the fabric ledger, it needs `emailId` as a query param of the candidate who has already taken the exam/test. Check [request](https://gist.github.com/cyproto/40ec270063eeba8cd9f02e8968ab5de5 "request") and [response](https://gist.github.com/cyproto/d77bb897ee417a668a25c7c8c9c84cae "response") formats. This API calls `queryResult` chaincode function.

- Other one is `sendResult` which takes the request in JSON, calculates result and pushes it to the blockchain.  Check the [request](https://gist.github.com/cyproto/7c8ac445d00b75e8093b6fbd6fe8f7e5 "request") and [response](https://gist.github.com/cyproto/de499d3f42e50cbf3a941ac40294025f "response"). This API calls
`createResult` with appropriate args.

## Chaincode:
- For now tis just has 3 basic functions as `initLedger` which initializes the ledger with some dummy values as soon as chaincode is deployed.
- Then there's `queryResult` which uses 'emailId' as an argument to pull state/data from the ledger.
- Finally `createResult`  is used to insert result in the blockchain.

## Screenshots:
#### getResult
<img src="https://i.imgur.com/HYAdyNb.png" width="500">

#### sendResult
<img src="https://i.imgur.com/tOg88xq.png" width="500">