# #!/usr/bin/env sh
# # O primeiro linha indica ao sistema que este arquivo deve ser executado usando o interpretador de shell 'sh'.

# # SPDX-License-Identifier: Apache-2.0
# # Este é um aviso de licença que informa sob qual licença o código é distribuído.

# set -eu
# # 'set' é um comando que altera as configurações do shell.
# # '-e' faz com que o script saia imediatamente se um comando retornar um status de erro.
# # '-u' faz com que o script saia se você tentar usar uma variável não definida.

# # Função para exibir mensagens de ajuda sobre o uso do script
# printHelp() {
#   USAGE="${1:-}"  # Se um argumento for passado, ele será usado como USAGE; caso contrário, será uma string vazia.
  
#   # Exibe a ajuda específica para o modo 'start'
#   if [ "$USAGE" = "start" ]; then
#     echo "Usage: "  # Exibe "Usage: " para indicar o início das instruções de uso.
#     echo "  network.sh start [Flags]"  # Indica como usar o script para iniciar a rede.
#     echo  # Exibe uma linha em branco.

#     echo "  Starts the test network"  # Descrição do que o modo 'start' faz.
#     echo  # Linha em branco.

#     echo "    Flags:"  # Inicia a seção de flags (opções).
#     echo "    -d <delay> - CLI delays for a certain number of seconds (defaults to 3)"  # Explica a flag -d.
#     echo "    -h - Print this message"  # Explica a flag -h.

#   # Exibe a ajuda específica para o modo 'clean'
#   elif [ "$USAGE" = "clean" ]; then
#     echo "Usage: "  # Início das instruções de uso para o modo 'clean'.
#     echo "  network.sh clean [Flags]"  # Como usar o script para limpar a rede.
#     echo  # Linha em branco.

#     echo "  Cleans the test network configuration and data files"  # Descrição do que o modo 'clean' faz.
#     echo  # Linha em branco.

#     echo "    Flags:"  # Início da seção de flags para o modo 'clean'.
#     echo "    -h - Print this message"  # Explica a flag -h.

#   else
#     # Exibe uma ajuda padrão se o modo não for 'start' ou 'clean'.
#     echo "Usage: "
#     echo "  network.sh <Mode> [Flags]"  # Como usar o script em geral.
#     echo "    Modes:"  # Início da seção de modos.
#     echo "      start - Starts the test network"  # Descrição do modo 'start'.
#     echo "      clean - Cleans the test network configuration and data files"  # Descrição do modo 'clean'.
#     echo  # Linha em branco.

#     echo "    Flags:"  # Início da seção de flags.
#     echo "    -h - Print this message"  # Explica a flag -h.
#     echo  # Linha em branco.

#     echo " Examples:"  # Início da seção de exemplos.
#     echo "   network.sh start"  # Exemplo de uso do modo 'start'.
#   fi
# }

# # Função para parar a rede Fabric
# networkStop() {
#   echo "Stopping Fabric network..."  # Mensagem informando que a rede está sendo parada.
  
#   # Interrompe todos os processos em segundo plano e aguarda sua finalização.
#   trap " " 0 1 2 3 15 && kill -- -$$
#   wait  # Espera até que todos os processos filhos terminem.
  
#   echo "Fabric network stopped."  # Mensagem informando que a rede foi parada.
# }

# # Função para iniciar a rede Fabric
# networkStart() {
#   : "${CLI_DELAY:=5}"  # Define o atraso padrão para 5 segundos se não estiver definido.

#   # Configura um trap para parar a rede ao final do script.
#   trap networkStop 0 1 2 3 15

#   # Verifica se os artefatos da rede já existem, caso contrário, gera-os.
#   if [ -d "${PWD}"/channel-artifacts ] && [ -d "${PWD}"/crypto-config ]; then
#     echo "Using existing artifacts..."  # Mensagem informando que os artefatos existentes serão usados.
#     CREATE_CHANNEL=false  # Define que o canal não precisa ser criado novamente.
#   else
#     echo "Generating artifacts..."  # Mensagem informando que os artefatos estão sendo gerados.
#     ./generate_artifacts.sh  # Executa o script para gerar os artefatos necessários.
#     CREATE_CHANNEL=true  # Define que um novo canal precisa ser criado.
#   fi

#   # Cria um diretório para armazenar logs.
#   echo "Creating logs directory..."
#   mkdir -p "${PWD}"/logs  # Cria o diretório 'logs', sem erro se já existir.

#   # Inicia os nós de ordenação em segundo plano e redireciona a saída para arquivos de log.
#   echo "Starting orderers..."
#   ./orderer1.sh > ./logs/orderer1.log 2>&1 &  # Inicia o primeiro nó de ordenação.
#   ./orderer2.sh > ./logs/orderer2.log 2>&1 &  # Inicia o segundo nó de ordenação.
#   ./orderer3.sh > ./logs/orderer3.log 2>&1 &  # Inicia o terceiro nó de ordenação.

#   # Aguarda o tempo de atraso especificado antes de iniciar os peers.
#   echo "Waiting ${CLI_DELAY}s..."
#   sleep ${CLI_DELAY}  # Pausa a execução pelo tempo definido em CLI_DELAY.

#   # Inicia os nós de peer em segundo plano e redireciona a saída para arquivos de log.
#   echo "Starting peers..."
#   ./peer1.sh > ./logs/peer1.log 2>&1 &  # Inicia o primeiro nó de peer.
#   ./peer2.sh > ./logs/peer2.log 2>&1 &  # Inicia o segundo nó de peer.
#   ./peer3.sh > ./logs/peer3.log 2>&1 &  # Inicia o terceiro nó de peer.
#   ./peer4.sh > ./logs/peer4.log 2>&1 &  # Inicia o quarto nó de peer.

#   # Aguarda o tempo de atraso especificado antes de criar o canal.
#   echo "Waiting ${CLI_DELAY}s..."
#   sleep ${CLI_DELAY}  # Pausa a execução novamente.

#   # Se os artefatos foram criados, cria o canal e junta os peers.
#   if [ "${CREATE_CHANNEL}" = "true" ]; then
#     echo "Creating channel (peer1)..."  # Mensagem informando que o canal está sendo criado.
#     . ./peer1admin.sh && ./create_channel.sh  # Executa o script para criar o canal.

#     echo "Joining channel (peer2)..."  # Mensagem informando que o peer2 está se juntando ao canal.
#     . ./peer2admin.sh && ./join_channel.sh  # Executa o script para juntar o peer2 ao canal.

#     echo "Joining channel (peer3)..."  # Mensagem para o peer3.
#     . ./peer3admin.sh && ./join_channel.sh  # Junta o peer3 ao canal.

#     echo "Joining channel (peer4)..."  # Mensagem para o peer4.
#     . ./peer4admin.sh && ./join_channel.sh  # Junta o peer4 ao canal.
#   fi

#   echo "Fabric network running. Use Ctrl-C to stop."  # Mensagem informando que a rede está em execução.

#   # Aguarda os processos em segundo plano terminarem.
#   wait
# }

# # Função para limpar os diretórios da rede Fabric
# networkClean() {
#   echo "Removing directories: channel-artifacts crypto-config data logs"  # Mensagem sobre remoção de diretórios.
#   # Remove os diretórios especificados, sem erro se não existirem.
#   rm -r "${PWD}"/channel-artifacts || true
#   rm -r "${PWD}"/crypto-config || true
#   rm -r "${PWD}"/data || true
#   rm -r "${PWD}"/logs || true
# }

# # Analisando argumentos da linha de comando

# # Verifica se há modo especificado.
# if [ $# -lt 1 ] ; then
#   printHelp  # Exibe ajuda se não houver modo especificado.
#   exit 0
# else
#   MODE=$1  # Define o modo como o primeiro argumento.
#   shift  # Remove o primeiro argumento da lista.
# fi

# # Analisa as flags passadas.
# while [ $# -ge 1 ] ; do
#   key="$1"  # A primeira flag é armazenada em 'key'.
#   case $key in
#   -d )
#     CLI_DELAY="$2"  # Define o atraso se a flag -d for usada.
#     shift  # Remove a flag e o valor dela da lista.
#     ;;
#   -h )
#     printHelp "$MODE"  # Exibe ajuda para o modo atual.
#     exit 0
#     ;;
#   * )
#     echo "Unknown flag: $key"  # Trata flags desconhecidas.
#     printHelp  # Exibe a ajuda.
#     exit 1
#     ;;
#   esac
#   shift  # Remove a flag da lista.
# done

# # Inicia a rede ou a limpa, dependendo do modo.
# if [ "$MODE" = "start" ]; then
#   networkStart  # Chama a função para iniciar a rede.
# elif [ "$MODE" = "clean" ]; then
#   networkClean  # Chama a função para limpar os dados da rede.
# else
#   printHelp  # Exibe ajuda se o modo não for reconhecido.
#   exit 1
# fi
















#!/usr/bin/env sh
# O primeiro linha indica ao sistema que este arquivo deve ser executado usando o interpretador de shell 'sh'.

# SPDX-License-Identifier: Apache-2.0
# Este é um aviso de licença que informa sob qual licença o código é distribuído.

set -eu
# 'set' é um comando que altera as configurações do shell.
# '-e' faz com que o script saia imediatamente se um comando retornar um status de erro.
# '-u' faz com que o script saia se você tentar usar uma variável não definida.

# Função para exibir mensagens de ajuda sobre o uso do script
printHelp() {
  USAGE="${1:-}"  # Se um argumento for passado, ele será usado como USAGE; caso contrário, será uma string vazia.
  
  # Exibe a ajuda padrão
  echo "Usage: "
  echo "  network.sh <Mode> [Flags]"  # Como usar o script em geral.
  echo "    Modes:"  # Início da seção de modos.
  echo "      start - Starts the test network"  # Descrição do modo 'start'.
  echo "      clean - Cleans the test network configuration and data files"  # Descrição do modo 'clean'.
  echo  # Linha em branco.

  echo "    Flags:"  # Início da seção de flags.
  echo "    -h - Print this message"  # Explica a flag -h.
  echo  # Linha em branco.

  echo " Examples:"  # Início da seção de exemplos.
  echo "   network.sh start"  # Exemplo de uso do modo 'start'.
}

# Função para parar a rede Fabric
networkStop() {
  echo "Stopping Fabric network..."  # Mensagem informando que a rede está sendo parada.
  
  # Interrompe todos os processos em segundo plano
  trap " " 0 1 2 3 15 && kill -- -$$
  wait  # Espera até que todos os processos filhos terminem.
  
  echo "Fabric network stopped."  # Mensagem informando que a rede foi parada.
}

# Função para iniciar a rede Fabric
networkStart() {
  # Define o atraso padrão para 5 segundos
  : "${CLI_DELAY:=5}"

  # Configura um trap para parar a rede ao final do script
  trap networkStop 0 1 2 3 15

  # Verifica se os artefatos já existem, caso contrário, gera-os
  if [ -d "${PWD}"/channel-artifacts ] && [ -d "${PWD}"/crypto-config ]; then
    echo "Using existing artifacts..."  # Mensagem informando que os artefatos existentes serão usados.
    CREATE_CHANNEL=false  # Define que o canal não precisa ser criado novamente.
  else
    echo "Generating artifacts..."  # Mensagem informando que os artefatos estão sendo gerados.
    ./generate_artifacts.sh  # Executa o script para gerar os artefatos necessários.
    CREATE_CHANNEL=true  # Define que um novo canal precisa ser criado.
  fi

  # Cria um diretório para logs
  echo "Creating logs directory..."
  mkdir -p "${PWD}"/logs  # Cria o diretório 'logs', sem erro se já existir.

  # Inicia os nós de ordenação em segundo plano, redirecionando logs
  echo "Starting orderer..."
  ./orderer1.sh > ./logs/orderer1.log 2>&1 &  # Inicia o único nó de ordenação.

  # Aguarda um atraso antes de iniciar os peers
  echo "Waiting ${CLI_DELAY}s..."
  sleep ${CLI_DELAY}  # Pausa a execução pelo tempo definido em CLI_DELAY.

  # Inicia os nós de peer em segundo plano, redirecionando logs
  echo "Starting peers..."
  ./peer1.sh > ./logs/peer1.log 2>&1 &  # Inicia o primeiro nó de peer.
  ./peer2.sh > ./logs/peer2.log 2>&1 &  # Inicia o segundo nó de peer.

  # Aguarda outro atraso
  echo "Waiting ${CLI_DELAY}s..."
  sleep ${CLI_DELAY}  # Pausa a execução novamente.

  # Se os artefatos foram criados, cria o canal e junta os peers
  if [ "${CREATE_CHANNEL}" = "true" ]; then
    echo "Creating channel (peer1)..."
    . ./peer1admin.sh && ./create_channel.sh  # Cria o canal

    echo "Joining channel (peer2)..."
    . ./peer2admin.sh && ./join_channel.sh  # Junta o peer2 ao canal
  fi

  echo "Fabric network running. Use Ctrl-C to stop."  # Mensagem informando que a rede está em execução.
  
  # Aguarda os processos em segundo plano
  wait
}

# Função para limpar os diretórios da rede Fabric
networkClean() {
  echo "Removing directories: channel-artifacts crypto-config data logs"  # Mensagem sobre remoção de diretórios.
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
  shift  # Remove o primeiro argumento da lista
fi

# Analisa as flags
while [ $# -ge 1 ] ; do
  key="$1"  # Armazena a primeira flag em 'key'
  case $key in
  -d )
    CLI_DELAY="$2"  # Define o atraso se a flag -d for usada
    shift  # Remove a flag e o valor dela da lista
    ;;
  -h )
    printHelp "$MODE"  # Exibe ajuda para o modo atual
    exit 0
    ;;
  * )
    echo "Unknown flag: $key"  # Trata flags desconhecidas
    printHelp  # Exibe a ajuda
    exit 1
    ;;
  esac
  shift  # Remove a flag da lista
done

# Inicia a rede ou a limpa, dependendo do modo
if [ "$MODE" = "start" ]; then
  networkStart  # Chama a função para iniciar a rede
elif [ "$MODE" = "clean" ]; then
  networkClean  # Chama a função para limpar os dados da rede
else
  printHelp  # Exibe ajuda se o modo não for reconhecido
  exit 1
fi
