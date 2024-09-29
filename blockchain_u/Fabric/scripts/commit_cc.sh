#!/bin/bash
set -e
org=$1
channel=$2

#Set environment
export FABRIC_CFG_PATH=$(pwd)/config
export CORE_PEER_LOCALMSPID=${org}MSP
export CORE_PEER_MSPCONFIGPATH=$(pwd)/msp/${org}/${org,,}admin/msp
export CORE_PEER_ADDRESS=${org,,}peer-api.127-0-0-1.nip.io:8080

#Commit CC
echo "Commiting chaincode through ${org}..."
peer lifecycle chaincode commit -o orderer-api.127-0-0-1.nip.io:8080 --channelID ${channel} --name chaincode --version 1 --sequence 1
sleep 3