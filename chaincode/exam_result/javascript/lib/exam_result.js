/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class ExamResult extends Contract {

    async initLedger(ctx) {

        const result = {
                examQuestions: 'a',
                correctAnswers: '0',
                percentage: '0',
                grade: 'NA',
                questionsCount: '0'
            };

        await ctx.stub.putState('example@gmail.com', Buffer.from(JSON.stringify(result)));
    }

    async queryResult( ctx, emailId ) {

        const resultAsBytes = await ctx.stub.getState( emailId );

        if ( !resultAsBytes || resultAsBytes.length === 0 ) {
            throw new Error( `${emailId} does not exist` );
        }

        return resultAsBytes.toString();
    }

    async createResult( ctx, emailId, examQuestions, correctAnswersCount, percentage, grade, questionsCount ) {

        const result = {
            examQuestions,
            correctAnswersCount,
            percentage,
            grade,
            questionsCount
        }
        
        await ctx.stub.putState(emailId, Buffer.from(JSON.stringify( result )));
    }  

}

module.exports = ExamResult;
