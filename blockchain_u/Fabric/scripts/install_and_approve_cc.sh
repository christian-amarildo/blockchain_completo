#!/bin/bash
set -e
org=$1
channel=$2

#Set environment
export FABRIC_CFG_PATH=$(pwd)/config
export CORE_PEER_LOCALMSPID=${org}MSP
export CORE_PEER_MSPCONFIGPATH=$(pwd)/msp/${org}/${org,,}admin/msp
export CORE_PEER_ADDRESS=${org,,}peer-api.127-0-0-1.nip.io:8080

#Install CC
echo "Installing chaincode in ${org}..."
export CC_PACKAGE_ID=`peer lifecycle chaincode install chaincode/chaincode.tgz 2>&1 | sed -n "s/^.*identifier: \s*\(\S*\).*$/\1/p" `
sleep 2

#Approve CC
echo "Approving chaincode in ${org}..."
peer lifecycle chaincode approveformyorg -o orderer-api.127-0-0-1.nip.io:8080 --channelID ${channel} --name chaincode --version 1 --sequence 1 --waitForEvent --package-id ${CC_PACKAGE_ID}
sleep 2