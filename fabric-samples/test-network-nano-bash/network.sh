#!/usr/bin/env sh
#
# SPDX-License-Identifier: Apache-2.0
#
set -eu

# Função para exibir mensagens de ajuda sobre o uso do script
printHelp() {
  USAGE="${1:-}"
  # Exibe a ajuda específica para o modo 'start'
  if [ "$USAGE" = "start" ]; then
    echo "Usage: "
    echo "  network.sh start [Flags]"
    echo
    echo "  Starts the test network"
    echo
    echo "    Flags:"
    echo "    -d <delay> - CLI delays for a certain number of seconds (defaults to 3)"
    echo "    -h - Print this message"
  # Exibe a ajuda específica para o modo 'clean'
  elif [ "$USAGE" = "clean" ]; then
    echo "Usage: "
    echo "  network.sh clean [Flags]"
    echo
    echo "  Cleans the test network configuration and data files"
    echo
    echo "    Flags:"
    echo "    -h - Print this message"
  else
    # Exibe a ajuda padrão
    echo "Usage: "
    echo "  network.sh <Mode> [Flags]"
    echo "    Modes:"
    echo "      start - Starts the test network"
    echo "      clean - Cleans the test network configuration and data files"
    echo
    echo "    Flags:"
    echo "    -h - Print this message"
    echo
    echo " Examples:"
    echo "   network.sh start"
  fi
}

# Função para parar a rede Fabric
networkStop() {
  echo "Stopping Fabric network..."
  # Interrompe todos os processos em segundo plano
  trap " " 0 1 2 3 15 && kill -- -$$
  wait
  echo "Fabric network stopped."
}

# Função para iniciar a rede Fabric
networkStart() {
  # Define o atraso padrão para 5 segundos
  : "${CLI_DELAY:=5}"

  # Configura um trap para parar a rede ao final do script
  trap networkStop 0 1 2 3 15

  # Verifica se os artefatos já existem, caso contrário, gera-os
  if [ -d "${PWD}"/channel-artifacts ] && [ -d "${PWD}"/crypto-config ]; then
    echo "Using existing artifacts..."
    CREATE_CHANNEL=false
  else
    echo "Generating artifacts..."
    ./generate_artifacts.sh  # Gera artefatos necessários para a rede
    CREATE_CHANNEL=true
  fi

  # Cria um diretório para logs
  echo "Creating logs directory..."
  mkdir -p "${PWD}"/logs

  # Inicia os nós de ordenação em segundo plano, redirecionando logs
  echo "Starting orderers..."
  ./orderer1.sh > ./logs/orderer1.log 2>&1 &
  ./orderer2.sh > ./logs/orderer2.log 2>&1 &
  ./orderer3.sh > ./logs/orderer3.log 2>&1 &

  # Aguarda um atraso antes de iniciar os peers
  echo "Waiting ${CLI_DELAY}s..."
  sleep ${CLI_DELAY}

  # Inicia os nós de peer em segundo plano, redirecionando logs
  echo "Starting peers..."
  ./peer1.sh > ./logs/peer1.log 2>&1 &
  ./peer2.sh > ./logs/peer2.log 2>&1 &
  ./peer3.sh > ./logs/peer3.log 2>&1 &
  ./peer4.sh > ./logs/peer4.log 2>&1 &

  # Aguarda outro atraso
  echo "Waiting ${CLI_DELAY}s..."
  sleep ${CLI_DELAY}

  # Se os artefatos foram criados, cria o canal e junta os peers
  if [ "${CREATE_CHANNEL}" = "true" ]; then
    echo "Creating channel (peer1)..."
    . ./peer1admin.sh && ./create_channel.sh  # Cria o canal

    echo "Joining channel (peer2)..."
    . ./peer2admin.sh && ./join_channel.sh  # Junta o peer2 ao canal

    echo "Joining channel (peer3)..."
    . ./peer3admin.sh && ./join_channel.sh  # Junta o peer3 ao canal

    echo "Joining channel (peer4)..."
    . ./peer4admin.sh && ./join_channel.sh  # Junta o peer4 ao canal
  fi

  echo "Fabric network running. Use Ctrl-C to stop."
  
  # Aguarda os processos em segundo plano
  wait
}

# Função para limpar os diretórios da rede Fabric
networkClean() {
  echo "Removing directories: channel-artifacts crypto-config data logs"
  # Remove os diretórios especificados
  rm -r "${PWD}"/channel-artifacts || true
  rm -r "${PWD}"/crypto-config || true
  rm -r "${PWD}"/data || true
  rm -r "${PWD}"/logs || true
}

# Analisando argumentos da linha de comando

# Verifica se há modo especificado
if [ $# -lt 1 ] ; then
  printHelp  # Exibe ajuda se não houver modo
  exit 0
else
  MODE=$1  # Define o modo como o primeiro argumento
  shift
fi

# Analisa as flags
while [ $# -ge 1 ] ; do
  key="$1"
  case $key in
  -d )
    CLI_DELAY="$2"  # Define o atraso
    shift
    ;;
  -h )
    printHelp "$MODE"  # Exibe ajuda para o modo atual
    exit 0
    ;;
  * )
    echo "Unknown flag: $key"  # Trata flags desconhecidas
    printHelp
    exit 1
    ;;
  esac
  shift
done

# Inicia a rede ou a limpa, dependendo do modo
if [ "$MODE" = "start" ]; then
  networkStart
elif [ "$MODE" = "clean" ]; then
  networkClean
else
  printHelp  # Exibe ajuda se o modo não for reconhecido
  exit 1
fi
