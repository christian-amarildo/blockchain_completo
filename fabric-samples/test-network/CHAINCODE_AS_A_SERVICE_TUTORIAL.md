# Executando Chaincode como serviço com a rede de teste

O recurso chaincode-as-a-service é uma maneira muito útil e prática de executar 'Contratos inteligentes'. Tradicionalmente, o Fabric Peer assumiu o papel de orquestrar o ciclo de vida completo do chaincode. Ele exigia acesso ao Docker Daemon para criar imagens e iniciar contêineres. As estruturas de chaincode Java, Node.js e Go eram explicitamente conhecidas pelo peer, incluindo como elas deveriam ser construídas e iniciadas.

Como resultado, isso torna muito difícil implantar em ambientes de estilo Kubernetes (K8S) ou executar em qualquer forma de modo de depuração. Além disso, o código está sendo reconstruído pelo peer, portanto, há algum grau de incerteza sobre quais dependências foram obtidas.

O Chaincode-as-service exige que você mesmo orquestre a fase de construção e implantação. Embora esta seja uma etapa adicional, ela devolve o controle. O Peer ainda requer que um 'pacote chaincode' seja instalado. Neste caso, isso não contém código, mas as informações sobre onde o chaincode está hospedado. (Nome do host, porta, configuração TLS etc.)

## Melhorias no Fabric v2.4.1

Precisamos usar a versão 2.4.1 mais recente, pois ela contém algumas melhorias para facilitar esse processo. A funcionalidade principal está disponível em versões anteriores, mas requer mais configuração.

- A imagem do docker para o peer contém um construtor para chaincode-as-a-service pré-configurado. Ele é chamado de 'ccaasbuilder'. Isso elimina a necessidade de construir seu próprio construtor externo e reempacotar e configurar o peer
- Os aplicativos `ccaasbuilder` estão incluídos no download do arquivo binário tgz para uso em outras circunstâncias. O `sampleconfig/core.yaml` também é atualizado para se referir a 'ccaasbuilder'
- A versão 2.4.1 do Java Chaincode foi atualizada para eliminar a necessidade de escrever uma classe principal bootstrap personalizada, semelhante ao Chaincode do Node.js. A intenção é que isso também seja adicionado ao chaincode go.

## De ponta a ponta com a rede de teste

A `test-network` e alguns dos chaincodes foram atualizados para oferecer suporte à execução do chaincode como serviço. Os comandos abaixo pressupõem que você tenha as amostras de fabric mais recentes clonadas, junto com as imagens do docker mais recentes do Fabric.

É útil ter duas janelas de terminal abertas, uma para iniciar a Fabric Network e uma segunda para monitorar todos os contêineres do docker.

Na sua janela de 'monitoramento', execute isso para observar todas as atividades de todos os contêineres do docker na rede `fabric_test`; isso monitorará todos os contêineres do docker que são adicionados à rede `fabric-test`. A rede geralmente é criada pelo comando `./network.sh up`, então lembre-se de atrasar a execução até que pelo menos a rede seja criada. É possível pré-criar a rede com `docker network create fabric-test` se desejar.

```bash
# do repositório fabric-samples
./test-network/monitordocker.sh
```

Na janela 'Fabric Network', inicie a rede de teste

```bash
cd test-network
./network.sh up createChannel -ca
```

Você pode executar outras variantes deste comando, por exemplo, para usar CouchDB ou CAs, sem afetar o recurso '-as-a-service'. As três etapas principais são:

- Crie uma imagem docker do contrato. Ambos `/asset-transfer-basic/chaincode-typescript` e `/asset-transfer-basic/chaincode-java` foram atualizados com Dockerfiles
- Instale, aprove e confirme uma definição de chaincode. Isso não foi alterado, mas o pacote chaincode contém informações de conexão (nome do host, porta, certificados TLS etc.), não código
- Inicie o(s) contêiner(es) docker contendo o contrato

Observe que a ordem listada não é obrigatória. O mais importante é que os contêineres estejam em execução antes que a primeira transação seja definida pelo peer. Lembre-se de que isso pode estar no `commit` se o sinalizador `initRequired` estiver definido.

Esta sequência pode ser executada da seguinte forma

```bash
./network.sh deployCCAAS -ccn basicts -ccp ../asset-transfer-basic/chaincode-typescript
```

Isso é muito semelhante ao comando `deployCC`, ele precisa do nome e do caminho. Mas também precisa ter a porta que o contêiner chaincode usará. Como cada contêiner está na rede `fabric-test`, você pode querer alterar isso para que não haja colisões com outros contêineres chaincode.

Você deve conseguir ver o contrato iniciando na janela de monitoramento. Haverá dois contêineres em execução, um para org1 e um para org2. Os nomes dos contêineres contêm a organização/peer e o nome do chaincode.

Para testar se as coisas estão funcionando, você pode invocar a função 'Contract Metadata'. Para obter informações sobre como trabalhar como diferentes organizações, consulte [Interagindo com a rede](https://hyperledger-fabric.readthedocs.io/en/latest/test_network.html#interacting-with-the-network)

```bash
# Variáveis ​​de ambiente para Org1

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/use
rs/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/../config

# invocar a função
peer chaincode query -C mychannel -n basicts -c '{"Args":["org.hyperledger.fabric:GetMetadata"]}' | jq
```

Se você não tiver `jq` instalado, omita `| jq`. Os metadados mostram os detalhes do contrato implantado e são JSON, então jq facilita a leitura. Você pode repetir os comandos acima para org2 para confirmar que está funcionando.

Para executar o exemplo Java, altere o comando `deployCCAAS` da seguinte forma. Isso criará dois novos contêineres.

```bash
./network.sh deployCCAAS -ccn basicj -ccp ../asset-transfer-basic/chaincode-java
```

Observe que todos os exemplos de aplicativos asset-transfer-basic usam 'basic' como o nome do chaincode e precisam ser ajustados para usar o nome 'basicts' ou 'basicj' adequadamente, ou você precisa usar o nome 'basic' nos comandos acima.

### Solução de problemas

Se a estrutura JSON passada for um JSON mal formatado, este erro estará no log do peer:

```
::Erro: Falha ao desempacotar json: não é possível desempacotar string no valor Go do tipo map[string]interface {} command=build
```

## Como configurar cada linguagem

Cada linguagem pode funcionar no modo 'como serviço'. Observe que as abordagens aqui são baseadas nas bibliotecas mais recentes.
Ao iniciar a imagem, você também pode especificar qualquer uma das opções TLS ou opções de registro adicionais para as respectivas bibliotecas chaincode.

### Java

Com as bibliotecas Java Chaincode v2.4.1, não há alterações de código para fazer ou construir alterações. O modo '-as-a-service' será usado se a variável de ambiente `CHAINCODE_SERVER_ADDRESS` estiver definida.

Um exemplo de comando docker run poderia ser o seguinte. As duas variáveis-chave necessárias são `CHAINCODE_SERVER_ADDRESS` e `CORE_CHAICODE_ID_NAME`

```bash
docker run --rm -d --name peer0org1_assettx_ccaas \
--network fabric_test \
-e CHAINCODE_SERVER_ADDRESS=0.0.0.0:9999 \
-e CORE_CHAINCODE_ID_NAME=<use package id here> \
assettx_ccaas_image:latest
```

### Node.js

Para o chaincode Node.js (JavaScript ou TypeScript), normalmente o `package.json` tem `fabric-chaincode-node start` como o comando de inicialização principal. Para executar no modo '-as-a-service', altere para `fabric-chaincode-node server --chaincode-address=$CHAINCODE_SERVER_ADDRESS --chaincode-id=$CHAINCODE_ID`

## Depurando o Chaincode

Executar no modo '-as-a-service' oferece opções, semelhantes a como o modo 'dev' do Fabric funciona na depuração de código. As restrições do modo 'dev' não se aplicam.

Há uma opção `-ccaasdocker false` que pode ser fornecida no comando `deployCCAAS`. Isso _não_ criará a imagem do docker ou iniciará um contêiner do docker. Ele emite os comandos que teria executado.

Execute este comando e você verá uma saída semelhante

```bash
./network.sh deployCCAAS -ccn basicj -ccp ../asset-transfer-basic/chaincode-java -ccaasdocker false
#....
Não está construindo a imagem do docker; este é o comando que teríamos executado
docker build -f ../asset-transfer-basic/chaincode-java/Dockerfile -t basicj_ccaas_image:latest --build-arg CC_SERVER_PORT=9999 ../asset-transfer-basic/chaincode-java
#....
Não está iniciando os contêineres do docker; estes são os comandos que teríamos executado
docker run --rm -d --name peer0org1_basicj_ccaas --network fabric_test -e CHAINCODE_SERVER_ADDRESS=0.0.0.0:9999 -e CHAINCODE_ID=basicj_1.0:59dcd73a14e2db8eab7f7683343ce27ac242b93b4e8075605a460d63a0438405 -e CORE_CHAINCODE_ID_NAME=basicj_1.0:59dcd73a14e2db8eab7f7683343ce27ac242b93b4e8075605a460d63a0438405 basicj_ccaas_image:latest
```

Dependendo de seu diretório e o que você precisa depurar, pode ser necessário ajustar esses comandos.

### Construindo a imagem do docker

A primeira coisa necessária é construir a imagem do docker. Lembre-se de que, desde que o peer possa se conectar ao hostname:port fornecido no `connection.json`, o empacotamento real do chaincode não é importante para o peer. Você tem a liberdade de ajustar os dockerfiles fornecidos aqui.

Para construir manualmente a imagem do docker para `asset-transfer-basic/chaincode-java`

```bash
docker build -f ../asset-transfer-basic/chaincode-java/Dockerfile -t basicj_ccaas_image:latest --build-arg CC_SERVER_PORT=9999 ../asset-transfer-basic/chaincode-java
```

### Iniciando o contêiner do docker

Você precisa iniciar o contêiner do docker.

NodeJs, por exemplo, podem ser iniciados assim

```bash
docker run --rm -it -p 9229:9229 --name peer0org2_basic_ccaas --network fabric_test -e DEBUG=true -e CHAINCODE_SERVER_ADDRESS=0.0.0.0:9999 -e CHAINCODE_ID=basic_1.0:7c7dff5cdc43c77ccea028c422b3348c3c1fb5a26ace0077cf3cc627bd355ef0 -e CORE_CHAINCODE_ID_NAME=basic_1.0:7c7dff5cdc43c77ccea028c422b3348c3c1fb5a26ace0077cf3cc627bd355ef0 basic_ccaas_image:latest
```

Java, por exemplo, poderia ser iniciado assim

```bash
docker run --rm -it --name peer0org1_basicj_ccaas -p 8000:8000 --network fabric_test -e DEBUG=true -e CHAINCODE_SERVER_ADDRESS=0.0.0.0:9999 -e CHAINCODE_ID=basicj_1.0:b014a03d8eb1898535e25b4dfeeb3f8244c9f07d91a06aec03e2d19174c45e4f -e CORE_CHAINCODE_ID_NAME=basicj_1.0:b014a03d8e
b1898535e25b4dfeeb3f8244c9f07d91a06aec03e2d19174c45e4f basicj_ccaas_image:latest
```

Para todos os idiomas, observe:

- o nome do contêiner precisa corresponder ao que o peer tem no `connection.json`
- o peer está se conectando ao contêiner chaincode por meio da rede docker. Portanto, a porta 9999 não precisa ser encaminhada para o host
- Se você for usar um único passo em um depurador, provavelmente atingirá o valor de tempo limite de transação do Fabric. Por padrão, é 30 segundos, o que significa que o chaincode precisa concluir as transações em 30 segundos ou menos. Em `test-network/docker/docker-composer-test-net.yml`, adicione `CORE_CHAINCODE_EXECUTETIMEOUT=300s` às opções de ambiente de cada peer.
- No comando acima, a opção `-d` foi removida do comando que o test-network teria usado e foi substituída por `-it`. Isso significa que o contêiner docker não será executado no modo desanexado e será executado em primeiro plano.

Para Node.js, observe:

- A porta 9229 é encaminhada, no entanto - esta é a porta de depuração usada pelo Node.js
- `-e DEBUG=true` acionará o tempo de execução do nó para ser iniciado no modo de depuração. Isso é codificado no script `docker/docker-entrypoint.sh` - este é um exemplo e você pode querer removê-lo em imagens de produção para segurança
- Se você estiver usando typescript, certifique-se de que o typescript foi compilado com sourcemaps, caso contrário, um depurador terá dificuldade em corresponder ao código-fonte.

Para Java, observe:

- A porta 800 é encaminhada, a porta de depuração para a JVM
- `-e DEBUG=true` acionará o tempo de execução do nó para ser iniciado no modo de depuração. Isso é codificado no script `docker/docker-entrypoint.sh` - este é um exemplo e você pode querer remover isso em imagens de produção para segurança
- No comando java com a opção para iniciar o depurador está `java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=0.0.0.0:8000 -jar /chaincode.jar` Observe o `0.0.0.0`, pois a porta de depuração precisa ser vinculada a todos os adaptadores de rede para que o depurador possa ser conectado de fora do contêiner

## Executando com vários pares

Na abordagem tradicional, cada par em que o chaincode é aprovado terá um contêiner executando o chaincode. Com a abordagem '-as-a-service', precisamos atingir a mesma arquitetura.

Como o `connection.json` contém o endereço do contêiner chaincode em execução, ele pode ser atualizado para garantir que cada par se conecte a um contêiner diferente. No entanto, como o `connection.json` no pacote chaincode, o Fabric exige que o ID do pacote seja consistente entre todos os pares em uma organização. Para conseguir isso
o construtor externo suporta um recurso de modelo. O contexto deste modelo é obtido de uma variável de ambiente definida em cada Peer. `CHAINCODE_AS_A_SERVICE_BUILDER_CONFIG`

Podemos definir o endereço para ser um modelo no `connection.json`

```json
{
"address": "{{.peername}}_assettransfer_ccaas:9999",
"dial_timeout": "10s",
"tls_required": false
}
```

Na configuração do ambiente do peer, definimos para o peer1 da org1

```bash
CHAINCODE_AS_A_SERVICE_BUILDER_CONFIG="{\"peername\":\"org1peer1\"}"
```

O construtor externo resolverá esse endereço para ser `org1peer1_assettransfer_ccaas:9999` para o peer usar.

Cada peer pode ter sua própria configuração separada e, portanto, endereços diferentes. A string JSON que é definida pode ter qualquer estrutura, desde que os modelos (na sintaxe de modelo golang) correspondam.

Qualquer valor no `connection.json` pode ser modelado - mas apenas os valores e não as chaves.