const express = require( 'express' );
const app = express();
var bodyParser = require( 'body-parser' );
var util = require( 'util' );
var cors = require( 'cors' );
const { Gateway, Wallets } = require( 'fabric-network' );
const path = require( 'path' );
const fs = require( 'fs' );
const PORT = 8080;
const HOST = 'localhost';

app.options( '*', cors() );
app.use( cors() );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {
	extended: false
} ) );

app.get( '/getResult', async ( req, res ) => {

    let emailId = req.query['emailId'];

    try {
        const ccpPath = path.resolve( __dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json' );
        const ccp = JSON.parse( fs.readFileSync(ccpPath, 'utf8') );
        const walletPath = path.join( process.cwd(), 'wallet' );
        const wallet = await Wallets.newFileSystemWallet( walletPath );

        console.log( `Wallet path: ${walletPath}` );

        const identity = await wallet.get( 'appUser' );
        if( !identity ) {
            console.log( 'An identity for the user "appUser" does not exist in the wallet' );
            console.log( 'Run the registerUser.js application before retrying' );
            return;
        }

        const gateway = new Gateway();
        await gateway.connect( ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } } );

        const network = await gateway.getNetwork( 'mychannel' );
        const contract = network.getContract( 'exam_result' );
        const result = JSON.parse( await contract.evaluateTransaction( 'queryResult', emailId ) );
        
        const responseResult = {
            correctAnswersCount: result['correctAnswersCount'],
            examQuestions: JSON.parse( result['examQuestions'] ),
            grade: result['grade'],
            percentage: result['percentage'],
            questionsCount: result['questionsCount']
        }

        res.status(200).json(responseResult);

    } catch ( error ) {
        console.error( `Failed to evaluate transaction: ${error}` );
    }

});

app.post( '/sendResult', async ( req, res ) => {

    let emailId = req.body['emailId'];
    let questionsData = req.body['questionsData'];
    let passingCutOff = req.body['passingCutOff'];
    let questionsCount = questionsData.length;
    let correctAnswersCount = 0;
    
    for( let i = 0; i < questionsCount; i++ ) {

        if( questionsData[i]['correct_option'] == questionsData[i]['selectedOption'] ) {
            correctAnswersCount++ ;
        }
    }

    let percentage = Math.round( correctAnswersCount/questionsCount*100 );
    let grade = '';
    if( percentage > passingCutOff ) {
        grade = 'Passed';
    } else {
        grade = 'Failed'
    }

    try {
        
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        const gateway = new Gateway();
        
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('exam_result');

        await contract.submitTransaction('createResult', emailId, JSON.stringify( questionsData ), correctAnswersCount.toString(), percentage.toString(), grade.toString(), questionsCount.toString() );
        console.log('Transaction has been submitted');

        const response = {
            result: 'Transaction has been submitted'
        }

        res.status(200).json(response);

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
});

app.listen( PORT, HOST );
console.log( `Running on http://${HOST}:${PORT}` );