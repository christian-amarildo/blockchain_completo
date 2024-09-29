[//]: # (SPDX-License-Identifier: CC-BY-4.0)

# Amostras do Hyperledger Fabric

[![Status da compilação](https://dev.azure.com/Hyperledger/Fabric-Samples/_apis/build/status/Fabric-Samples?branchName=main)](https://dev.azure.com/Hyperledger/Fabric-Samples/_build/latest?definitionId=28&branchName=main)

Você pode usar amostras do Fabric para começar a trabalhar com o Hyperledger Fabric, explorar recursos importantes do Fabric e aprender a criar aplicativos que podem interagir com redes de blockchain usando os SDKs do Fabric. Para saber mais sobre o Hyperledger Fabric, visite a [documentação do Fabric](https://hyperledger-fabric.readthedocs.io/en/latest).

## Começando com os exemplos do Fabric

Para usar os exemplos do Fabric, você precisa baixar as imagens do Docker do Fabric e as ferramentas do Fabric CLI. Primeiro, certifique-se de ter instalado todos os [pré-requisitos do Fabric](https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html). Você pode seguir as instruções para [Instalar os exemplos do Fabric, binários e imagens do Docker](https://hyperledger-fabric.readthedocs.io/en/latest/install.html) na documentação do Fabric. Além de baixar as imagens do Fabric e os binários das ferramentas, os exemplos do Fabric também serão clonados para sua máquina local.

## Rede de teste

A [rede de teste do Fabric](test-network) no repositório de exemplos fornece uma rede de teste baseada no Docker Compose com dois
Peers da organização e um nó de serviço de pedidos. Você pode usá-lo em sua máquina local para executar os exemplos listados abaixo.
Você também pode usá-lo para implantar e testar seus próprios chaincodes e aplicativos do Fabric. Para começar, veja
o [tutorial de rede de teste](https://hyperledger-fabric.readthedocs.io/en/latest/test_network.html).

O exemplo [Rede de teste do Kubernetes](test-network-k8s) se baseia na rede Compose, construindo uma rede Fabric
com nós de infraestrutura peer, orderer e CA em execução no Kubernetes. Além de fornecer um exemplo
de guia do Kubernetes, a rede de teste do Kube pode ser usada como uma plataforma para criar e depurar aplicativos Fabric Client _prontos para a nuvem_
em uma estação de trabalho de desenvolvimento ou CI.

## Exemplos e tutoriais de transferência de ativos

A série de transferência de ativos fornece uma série de exemplos de contratos inteligentes e aplicativos para demonstrar como armazenar e transferir ativos usando o Hyperledger Fabric.
Cada exemplo e tutorial associado na série demonstra uma capacidade principal diferente no Hyperledger Fabric. O exemplo **Básico** fornece uma introdução sobre como
escrever contratos inteligentes e como interagir com uma rede Fabric usando os Fabric SDKs. Os exemplos de **Consultas do Ledger**, **Dados privados** e **Endosso baseado em estado**
demonstram esses recursos adicionais. Por fim, o exemplo de **Acordo garantido** demonstra como reunir todos os recursos para transferir
um ativo com segurança em um cenário de transferência mais realista.

| **Contrato inteligente** | **Descrição** | **Tutorial** | **Linguagens de contrato inteligente** | **Linguagens de aplicativo** |
| -----------|------------------------------|----------|---------|---------|
| [Básico](asset-transfer-basic) | O exemplo básico de contrato inteligente que permite criar e transferir um ativo colocando dados no livro-razão e recuperando-os. Este exemplo é recomendado para novos usuários do Fabric. | [Escrevendo seu primeiro aplicativo](https://hyperledger-fabric.readthedocs.io/en/latest/write_first_app.html) | Go, JavaScript, TypeScript, Java | Go, JavaScript, TypeScript, Java |
| [Consultas de razão](asset-transfer-ledger-queries) | O exemplo de consultas de razão demonstra consultas de intervalo e atualizações de transações usando consultas de intervalo (aplicável para bancos de dados de estado LevelDB e CouchDB) e como implantar um índice com seu chaincode para dar suporte a consultas JSON (aplicável somente para banco de dados de estado CouchDB). | [Usando CouchDB](https://hyperledger-fabric.readthedocs.io/en/latest/couchdb_tutorial.html) | Go, JavaScript | Java, JavaScript |
| [Dados privados](asset-transfer-private-data) | Este exemplo demonstra o uso de coleções de dados privadas, como gerenciar coleções de dados privadas com o ciclo de vida do chaincode e como o hash de dados privados pode ser usado para verificar dados privados no razão. Ele também demonstra como controlar atualizações e transferências de ativos usando propriedade baseada em cliente e controle de acesso. | [Usando dados privados](https://hyperledger-fabric.readthedocs.io/en/latest/private_data_tutorial.html) | Go, Java | JavaScript |
| [Endosso baseado em estado](asset-transfer-sbe) | Este exemplo demonstra como substituir a política de endosso em nível de chaincode para definir políticas de endosso em nível de chave (nível de dados/ativo). | [Usando endosso baseado em estado](https://github.com/hyperledger/fabric-samples/tree/main/asset-transfer-sbe) | Java, TypeScript | JavaScript |
| [Acordo seguro](asset-transfer-secured-agreement) | Contrato inteligente que usa coleções de dados privados implícitos, endosso baseado em estado e propriedade e controle de acesso baseados em organização para manter os dados privados e transferir um ativo com segurança com o consentimento de ambos os proprietário e comprador do aluguel. | [Transferência de ativos segura](https://hyperledger-fabric.readthedocs.io/en/latest/secured_asset_transfer/secured_private_asset_transfer_tutorial.html) | Ir | JavaScript |
| [Eventos](asset-transfer-events) | O exemplo de eventos demonstra como os contratos inteligentes podem emitir eventos que são lidos pelos aplicativos que interagem com a rede. | [README](asset-transfer-events/README.md) | JavaScript, Java | JavaScript |
| [Controle de acesso baseado em atributos](asset-transfer-abac) | Demonstra o uso de controle de acesso baseado em atributos e identidades usando um cenário simples de transferência de ativos | [README](asset-transfer-abac/README.md) | Ir | Nenhum |

## Exemplos adicionais

Os exemplos adicionais demonstram vários casos de uso e padrões de aplicativos do Fabric.

| **Amostra** | **Descrição** | **Documentação** |
| -------------|------------------------------|------------------|
| [Dados off-chain](off_chain_data) | Aprenda a usar eventos de bloco para criar um banco de dados off-chain para relatórios e análises. | [Serviços de eventos baseados em canais peer](https://hyperledger-fabric.readthedocs.io/en/latest/peer_event_services.html) |
| [Token ERC-20](token-erc-20) | Contrato inteligente demonstrando como criar e transferir tokens fungíveis usando um modelo baseado em conta. | [README](token-erc-20/README.md) |
| [Token UTXO](token-utxo) | Contrato inteligente demonstrando como criar e transferir tokens fungíveis usando um modelo UTXO (saída de transação não gasta). | [README](token-utxo/README.md) |
| [Token ERC-1155](token-erc-1155) | Contrato inteligente demonstrando como criar e transferir vários tokens (fungíveis e não fungíveis) usando um modelo baseado em conta. | [README](token-erc-1155/README.md) |
| [Token ERC-721](token-erc-721) | Contrato inteligente demonstrando como criar e transferir tokens não fungíveis usando um modelo baseado em conta. | [README](token-erc-721/README.md) |
| [Alto rendimento](high-throughput) | Aprenda como você pode projetar seu contrato inteligente para evitar colisões de transações em ambientes de alto volume. | [README](high-throughput/README.md) |
| [Leilão simples](auction-simple) | Execute um leilão em que os lances sejam mantidos privados até o leilão ser encerrado, após o qual os usuários podem revelar seus lances. | [README](auction-simple/README.md) |
| [Leilão holandês](auction-dutch) | Execute um leilão no qual vários itens do mesmo tipo podem ser vendidos para mais de um comprador. Este exemplo também inclui a capacidade de adicionar uma organização de auditoria. | [README](auction-dutch/README.md) |
| [Chaincode](chaincode) | Um conjunto de outros contratos inteligentes de amostra, muitos dos quais foram usados ​​em tutoriais antes da série de amostra de transferência de ativos. | |
| [Swaps de taxa de juros](interest_rate_swaps) | **Descontinuado em favor da amostra de transferência de ativos de endosso baseada em estado** | |
| [Fabcar](fabcar) | **Descontinuado em favor da amostra básica de transferência de ativos** | |

## Licença <a name="license"></a>

Os arquivos de código-fonte do Hyperledger Project são disponibilizados sob a Apache
License, Versão 2.0 (Apache-2.0), localizada no arquivo [LICENSE](LICENSE).
Os arquivos de documentação do Hyperledger Project são disponibilizados sob a Creative
Commons Attribution 4.0 International License (CC-BY-4.0), disponível em http://creativecommons.org/licenses/by/4.0/.
