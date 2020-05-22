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

var FabricSdkService = require( './FabricSdkService' );

app.options( '*', cors() );
app.use( cors() );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {
	extended: false
} ) );

app.use( ( req, res, next ) => {
	FabricSdkService.attachFabricClient( req) ;
	next();
} );

app.get( '/getResult', async ( req, res ) => {
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
        const result = await contract.evaluateTransaction( 'queryResult', 'example@gmail.com' );

        res.status(200).json(JSON.parse(result));

    } catch ( error ) {
        console.error( `Failed to evaluate transaction: ${error}` );
        process.exit( 1 );
    }
});

app.listen( PORT, HOST );
console.log( `Running on http://${HOST}:${PORT}` );

