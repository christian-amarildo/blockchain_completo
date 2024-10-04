#!/usr/bin/env sh
# Esta linha é chamada de "shebang" e indica qual interpretador de comandos deve ser usado para executar o script. Aqui está configurado para o shell (sh) no ambiente encontrado pelo `env`.

# SPDX-License-Identifier: Apache-2.0
# SPDX é uma tag padrão usada para especificar a licença de código. Neste caso, indica que o script está sob a licença Apache 2.0.

set -eu
# O comando `set -e` faz com que o script pare se qualquer comando falhar (não retornar zero).
# O `-u` faz o script parar se uma variável não definida for usada.

if [ "$(uname)" = "Linux" ] ; then
  CCADDR="127.0.0.1"
else
  CCADDR="host.docker.internal"
fi
# A estrutura `if` verifica se o sistema operacional é Linux usando `uname`.
# Se for Linux, define a variável `CCADDR` com o valor "127.0.0.1" (endereço de loopback local).
# Caso contrário, define `CCADDR` como "host.docker.internal", que é o endereço interno de rede do Docker em outros sistemas, como o macOS.

# look for binaries in local dev environment /build/bin directory and then in local samples /bin directory
# Procura binários no diretório de desenvolvimento local "/build/bin" e, em seguida, no diretório "/bin" de exemplos locais.

export PATH="${PWD}"/../../fabric/build/bin:"${PWD}"/../bin:"$PATH"
# `export` define variáveis de ambiente que serão usadas por todos os comandos subsequentes.
# `PATH` é o caminho onde o sistema procura executáveis. Aqui ele é expandido para incluir dois diretórios adicionais:
# `${PWD}` é o diretório atual, concatenado com os caminhos relativos "/../../fabric/build/bin" e "/../bin".

export FABRIC_CFG_PATH="${PWD}"/../config
# Define a variável de ambiente `FABRIC_CFG_PATH`, que indica onde estão os arquivos de configuração do Hyperledger Fabric.
# Aqui, `${PWD}` aponta para o diretório atual, e "../config" especifica o caminho relativo para o diretório de configuração.

export FABRIC_LOGGING_SPEC=debug:cauthdsl,policies,msp,grpc,peer.gossip.mcs,gossip,leveldbhelper=info
# Define o nível de log do Hyperledger Fabric. `debug` significa que todos os logs de debug e acima serão registrados.
# A lista após `debug:` especifica os componentes que terão logs em níveis mais detalhados (debug ou info).

export CORE_PEER_TLS_ENABLED=true
# Habilita o uso de TLS (Transport Layer Security), um protocolo de segurança para comunicação segura entre peers.

export CORE_PEER_TLS_CERT_FILE="${PWD}"/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.crt
# Define o caminho para o arquivo de certificado TLS do peer, necessário para autenticar a conexão segura.
# `${PWD}` refere-se ao diretório atual, concatenado com o caminho para o certificado TLS do peer.

export CORE_PEER_TLS_KEY_FILE="${PWD}"/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key
# Define o caminho para a chave privada TLS usada pelo peer para estabelecer conexões seguras.
# `${PWD}` se refere ao diretório atual, e o caminho especifica o arquivo de chave privada.

export CORE_PEER_TLS_ROOTCERT_FILE="${PWD}"/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
# Define o caminho para o certificado raiz de CA (Certificate Authority) para validar conexões TLS.
# `${PWD}` é o diretório atual, concatenado com o caminho do certificado da autoridade certificadora.

export CORE_PEER_ID=peer0.org1.example.com
# Define o ID do peer, que é um identificador exclusivo no Hyperledger Fabric.
# Aqui está configurado como "peer0.org1.example.com", que indica o primeiro peer da organização 1.

export CORE_PEER_ADDRESS=127.0.0.1:7051
# Define o endereço de rede do peer. Neste caso, o peer está escutando no endereço de loopback (127.0.0.1) na porta 7051.

export CORE_PEER_LISTENADDRESS=127.0.0.1:7051
# Define o endereço no qual o peer escutará as conexões de outros peers. Aqui ele está escutando em 127.0.0.1 na porta 7051.

export CORE_PEER_CHAINCODEADDRESS="${CCADDR}":7052
# Define o endereço de rede onde o serviço de chaincode escuta, que é a variável `CCADDR` (dependente do SO) na porta 7052.

export CORE_PEER_CHAINCODELISTENADDRESS=127.0.0.1:7052
# Define o endereço onde o serviço de chaincode escutará as conexões. Aqui ele escuta em 127.0.0.1 na porta 7052.

# bootstrap peer is the other peer in the same org
# O "peer bootstrap" é o peer usado para inicializar a rede de gossip entre peers. Aqui, ele é configurado como o outro peer na mesma organização.

export CORE_PEER_GOSSIP_BOOTSTRAP=127.0.0.1:7053
# Define o peer de bootstrap do serviço de gossip. O gossip é o mecanismo pelo qual os peers compartilham informações entre si.
# Aqui está configurado para escutar em 127.0.0.1 na porta 7053.

export CORE_PEER_GOSSIP_EXTERNALENDPOINT=127.0.0.1:7051
# Define o endereço externo onde o peer vai expor seu serviço de gossip.
# Neste caso, ele escuta em 127.0.0.1 na porta 7051.

export CORE_PEER_LOCALMSPID=Org1MSP
# Define o identificador do MSP (Membership Service Provider) local. O MSP gerencia identidades e permissões.
# Aqui está configurado para "Org1MSP", que é o MSP da organização 1.

export CORE_PEER_MSPCONFIGPATH="${PWD}"/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/msp
# Define o caminho para os arquivos de configuração do MSP do peer.
# `${PWD}` é o diretório atual e o caminho especifica a localização da configuração MSP do peer.

export CORE_OPERATIONS_LISTENADDRESS=127.0.0.1:8446
# Define o endereço onde o serviço de operações do peer escutará. Ele escuta em 127.0.0.1 na porta 8446.

export CORE_PEER_FILESYSTEMPATH="${PWD}"/data/peer0.org1.example.com
# Define o caminho do sistema de arquivos onde os dados do peer serão armazenados.
# `${PWD}` é o diretório atual e o caminho aponta para o diretório de dados do peer.

export CORE_LEDGER_SNAPSHOTS_ROOTDIR="${PWD}"/data/peer0.org1.example.com/snapshots
# Define o diretório onde os snapshots (instantâneos do ledger) serão armazenados.
# `${PWD}` é o diretório atual e o caminho aponta para o diretório de snapshots.

# uncomment the lines below to utilize couchdb state database, when done with the environment you can stop the couchdb container with "docker rm -f couchdb1"
# As linhas abaixo podem ser descomentadas para usar o CouchDB como banco de dados de estado. O CouchDB armazena o estado mundial (world state) de maneira eficiente.
# O comando `docker run` cria e inicia um container CouchDB, e o `docker rm -f` pode ser usado para parar o container após o uso.

# export CORE_LEDGER_STATE_STATEDATABASE=CouchDB
# export CORE_LEDGER_STATE_COUCHDBCONFIG_COUCHDBADDRESS=127.0.0.1:5984
# export CORE_LEDGER_STATE_COUCHDBCONFIG_USERNAME=admin
# export CORE_LEDGER_STATE_COUCHDBCONFIG_PASSWORD=password
# docker run --publish 5984:5984 --detach -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password --name couchdb1 couchdb:3.1.1

# start peer
# Inicia o peer, que começa a funcionar como parte da rede do Hyperledger Fabric.
peer node start
# O comando `peer node start` inicia o peer, conectando-o à rede e preparando-o para processar transações e executar chaincodes.
