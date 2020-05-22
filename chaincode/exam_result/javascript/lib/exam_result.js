/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class ExamResult extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');

        const result = {
                examQuestions: 'a',
                correctAnswers: '0',
                percentage: '0',
                grade: 'NA',
                questionsCount: '0'
            };

        await ctx.stub.putState('example@gmail.com', Buffer.from(JSON.stringify(result)));
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryResult( ctx, emailId ) {
        const resultAsBytes = await ctx.stub.getState( emailId );
        if ( !resultAsBytes || resultAsBytes.length === 0 ) {
            throw new Error( `${emailId} does not exist` );
        }
        console.log( resultAsBytes.toString() );
        return resultAsBytes.toString();
    }

    // async createResult( ctx, emailId, questionsData, passingCutOff ) {

    //     let questionsCount = questionsData.length;
    //     let correctAnswersCount = 0;
    //     let promise = new Promise( ( resolve, reject ) => {
	//     for( let i = 0; i < questionsCount; i++ ) {
	// 	delete questionsData[i]['option_3'];
	// 	delete questionsData[i]['option_1'];
	// 	delete questionsData[i]['option_2'];
	// 	delete questionsData[i]['option_4'];
	// 	delete questionsData[i]['isBookmarked'];
	// 	delete questionsData[i]['question'];

	// 	if( questionsData[i]['correct_option'] == questionsData[i]['selectedOption'] ) {
	// 		correctAnswersCount++ ;
	// 	}
	// 	if( i == questionsCount-1 ) resolve();
    //         }
    //     });

    //     promise.then( () => {

    //         let percentage = Math.round( correctAnswersCount/questionsCount*100 );
    //         let grade = '';

    //         if( percentage > passingCutOff ) {
    //           grade = 'Passed';
    //         } else {
    //           grade = 'Failed'
    //         }

	//      questionsData
    //         const result = {
    //             examQuestions: JSON.stringify( questionsData ),
    //             correctAnswers: correctAnswersCount.toString(),
    //             percentage: percentage.toString(),
    //             grade: grade,
    //             questionsCount: questionsCount.toString()
    //         }

    //         //buffer = Buffer.from(JSON.stringify( result ));
    //         await ctx.stub.putState(emailId, Buffer.from(JSON.stringify( result )));
	//     //console.log(JSON.parse(buffer.toString()));
    //     });

        
    // }  

}

module.exports = ExamResult;
