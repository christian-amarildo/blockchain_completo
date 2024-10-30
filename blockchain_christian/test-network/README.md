# Executando a rede de teste

Você pode usar o script `./network.sh` para criar uma rede de teste simples do Fabric. A rede de teste tem duas organizações de pares com um par cada e um serviço de pedidos de raft de nó único. Você também pode usar o script `./network.sh` para criar canais e implantar o chaincode. Para obter mais informações, consulte [Usando a rede de teste do Fabric](https://hyperledger-fabric.readthedocs.io/en/latest/test_network.html). A rede de teste está sendo introduzida no Fabric v2.0 como a substituição de longo prazo para o exemplo `first-network`.

Antes de implantar a rede de teste, você precisa seguir as instruções para [Instalar os exemplos, binários e imagens do Docker](https://hyperledger-fabric.readthedocs.io/en/latest/install.html) na documentação do Hyperledger Fabric.

## Usando os comandos Peer

O script `setOrgEnv.sh` pode ser usado para configurar as variáveis ​​de ambiente para as organizações, isso ajudará a poder usar os comandos `peer` diretamente.

Primeiro, certifique-se de que os binários peer estejam no seu caminho e que o caminho Fabric Config esteja definido, supondo que você esteja no diretório `test-network`.

```bash
export PATH=$PATH:$(realpath ../bin)
export FABRIC_CFG_PATH=$(realpath ../config)
```

Você pode então configurar as variáveis ​​de ambiente para cada organização. O comando `./setOrgEnv.sh` foi projetado para ser executado da seguinte forma.

```bash
export $(./setOrgEnv.sh Org2 | xargs)
```

(Observe que o bash v4 é necessário para os scripts.)

Agora você poderá executar os comandos `peer` no contexto do Org2. Se um prompt de comando diferente, você pode executar o mesmo comando com Org1.
O script `setOrgEnv` gera uma série de strings `<name>=<value>`. Elas podem então ser alimentadas no comando export para seu shell atual.

## Chaincode-as-a-service

Para saber mais sobre como usar as melhorias no Chaincode-as-a-service, consulte este [tutorial](./test-network/../CHAINCODE_AS_A_SERVICE_TUTORIAL.md). Espera-se que isso aumente o tutorial no [Hyperledger Fabric ReadTheDocs](https://hyperledger-fabric.readthedocs.io/en/release-2.4/cc_service.html)

## Podman

*Observação - o suporte ao podman deve ser considerado experimental, mas o seguinte foi relatado para funcionar com o podman 4.1.1 no Mac. Se você deseja usar o podman, um LinuxVM é recomendado.*

O script `install-fabric.sh` do Fabric foi aprimorado para suportar o uso do `podman` para baixar imagens e marcá-las em vez do docker. As imagens são as mesmas, apenas extraídas de forma diferente. Basta especificar o argumento 'podman' ao executar o script `install-fabric.sh`.

Da mesma forma, o script `network.sh` foi aprimorado para que possa usar `podman` e `podman-compose` em vez do docker. Basta definir a variável de ambiente `CONTAINER_CLI` como `podman` antes de executar o script `network.sh`:

```bash
CONTAINER_CLI=podman ./network.sh up
````

Como não há Docker-Daemon ao usar o podman, apenas o comando `./network.sh deployCCAAS` funcionará. Seguir o tutorial Chaincode-as-a-service acima deve funcionar.
