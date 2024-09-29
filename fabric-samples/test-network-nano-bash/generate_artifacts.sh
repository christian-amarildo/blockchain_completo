#!/usr/bin/env sh
#
# SPDX-License-Identifier: Apache-2.0
#
# Este script é utilizado para gerar os artefatos necessários para a configuração de uma rede Hyperledger Fabric.
# Ele remove artefatos existentes e gera novos arquivos de configuração e certificados.

# O comando `set -eu` é usado para garantir que o script:
# - `-e`: Saia imediatamente se qualquer comando retornar um erro.
# - `-u`: Gere um erro se você tentar usar uma variável não inicializada.

set -eu

# Remove artefatos existentes, ou continua se os diretórios não existirem.
# A variável PWD representa o diretório de trabalho atual.
rm -r "${PWD}"/channel-artifacts || true  # Tenta remover o diretório channel-artifacts, se existir.
rm -r "${PWD}"/crypto-config || true      # Tenta remover o diretório crypto-config, se existir.
rm -r "${PWD}"/data || true                # Tenta remover o diretório data, se existir.

# Adiciona os diretórios das ferramentas (binaries) do Hyperledger Fabric ao PATH
# O PATH é uma variável de ambiente que diz ao sistema onde procurar executáveis.
# O script procura binários na pasta local de desenvolvimento e na pasta de exemplos.
export PATH="${PWD}"/../../fabric/build/bin:"${PWD}"/../bin:"$PATH"

echo "Gerando certificados MSP usando a ferramenta cryptogen"
# O comando abaixo gera os certificados MSP (Membership Service Provider) usando a configuração especificada no arquivo crypto-config.yaml
cryptogen generate --config="${PWD}"/crypto-config.yaml

# Define a variável de ambiente FABRIC_CFG_PATH para o diretório que contém o arquivo de configuração configtx.yaml.
# Isso é importante porque o configtxgen precisa saber onde encontrar as definições de configuração para a rede.
export FABRIC_CFG_PATH="${PWD}"

echo "Gerando o bloco gênesis do orderer"
# O comando abaixo gera o bloco gênesis que é necessário para iniciar a rede de orderers.
# O bloco gênesis contém a configuração inicial da rede.
configtxgen -profile TwoOrgsOrdererGenesis -channelID test-system-channel-name -outputBlock channel-artifacts/genesis.block

echo "Gerando a transação de criação do canal"
# O comando abaixo gera um arquivo de transação que é usado para criar o canal.
# O canal é onde as transações ocorrerão na rede Hyperledger Fabric.
configtxgen -channelID mychannel -outputCreateChannelTx channel-artifacts/mychannel.tx -profile TwoOrgsChannel

echo "Gerando a transação de atualização do peer âncora para a Org1"
# O comando abaixo gera uma transação que atualiza a configuração do peer âncora da organização 1 (Org1).
# Um peer âncora é um peer que é designado para manter a comunicação entre canais.
configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate channel-artifacts/Org1MSPanchors.tx -channelID mychannel -asOrg Org1MSP

echo "Gerando a transação de atualização do peer âncora para a Org2"
# Semelhante ao anterior, este comando gera uma transação que atualiza a configuração do peer âncora da organização 2 (Org2).
configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate channel-artifacts/Org2MSPanchors.tx -channelID mychannel -asOrg Org2MSP

# O script termina aqui, e agora você deve ter todos os artefatos necessários gerados em seus respectivos diretórios.
