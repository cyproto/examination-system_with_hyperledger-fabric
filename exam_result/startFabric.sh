#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -e

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1
starttime=$(date +%s)
CC_SRC_LANGUAGE=${1:-"javascript"}
CC_SRC_LANGUAGE=`echo "$CC_SRC_LANGUAGE" | tr [:upper:] [:lower:]`
if [ "$CC_SRC_LANGUAGE" != "javascript" ] ; then

	echo The chaincode language ${CC_SRC_LANGUAGE} is not supported by this script
 	echo Supported chaincode languages are: javascript
 	exit 1

fi

# clean out any old identites in the wallets
rm -rf javascript/wallet/*

# launch network; create channel and join peer to channel
pushd ../test-network
./network.sh down
./network.sh up createChannel -ca -s couchdb
./network.sh deployCC -l ${CC_SRC_LANGUAGE}
popd

cat <<EOF

Total setup execution time : $(($(date +%s) - starttime)) secs ...

Steps:
    cd javascript
    npm install

  Then enroll admin and register a new user:
    node enrollAdmin
    node registerUser

  Now just run node app to start server:
    node app.js
  
  This will start server on localhost:8080 and you can access the getResult and sendResult apis
  with appropriate request object.

  getResult:
    URL: http://localhost:8080/getResult/?emailId=example@mail.com
  
  sendResult:
    URL: http://localhost:8080/sendResult/
    JSON request:
      {
        "emailId": "abc@gmail.com",
        "questionsData": [
          {
            "option_1": "System calls",
            "option_2": "API",
            "option_4": "Assembly instructions",
            "correct_option": "option_1",
            "questionId": "que2",
            "option_3": "Library",
            "question": "To access the services of operating system, the interface is provided by the:",
            "isBookmarked": false,
            "selectedOption": "option_1"
          },
          {
            "correct_option": "option_4",
            "questionId": "que1",
            "question": "What is operating system?",
            "option_3": "Link to interface the hardware and application programs",
            "option_1": "Collection of programs that manages hardware resources",
            "option_2": "System service provider to the application programs",
            "option_4": "All of the mentioned",
            "isBookmarked": false,
            "selectedOption": "option_4"
          },
          {
            "option_2": "Space division multiplexing",
            "option_4": "None of the mentioned",
            "correct_option": "option_3",
            "questionId": "que5",
            "option_3": "Both (1) and (2)",
            "question": "By operating system, the resource management can be done via:",
            "option_1": "Time division multiplexing",
            "isBookmarked": false,
            "selectedOption": "option_3"
          },
          {
            "option_2": "Bounded Waiting",
            "option_4": "Progress",
            "correct_option": "option_2",
            "questionId": "que12",
            "question": "Spinlocks are intended to provide __________ only.",
            "option_3": "Aging",
            "option_1": "Mutual Exclusion",
            "isBookmarked": false,
            "selectedOption": "option_2"
          },
          {
            "questionId": "que8",
            "question": "OS X has:",
            "option_3": "Microkernel",
            "option_1": "Monolithic kernel",
            "option_2": "Hybrid kernel",
            "option_4": "Monolithic kernel with modules",
            "correct_option": "option_2",
            "isBookmarked": false,
            "selectedOption": "option_3"
          }
        ],
        "passingCutOff": 35
      }
EOF
