#!/bin/bash
set -e

#Set environment
export FABRIC_CFG_PATH=$(pwd)/config

#Remove previous package
rm -f ./chaincode/chaincode.tgz

#Package
echo "Packaging chaincode..."
peer lifecycle chaincode package ./chaincode/chaincode.tgz --path ./chaincode --lang golang --label chaincode