# Descrição das Pastas no Projeto Hyperledger Fabric

Este arquivo fornece uma descrição detalhada das pastas e seus conteúdos no projeto Hyperledger Fabric. Ele foi criado para ajudar desenvolvedores e colaboradores a entender a função de cada diretório e como eles se encaixam no ecossistema do Hyperledger Fabric.

---

## Estrutura de Diretórios

### .github
Contém arquivos de configuração do GitHub, como workflows para automação de CI/CD e templates para issues e pull requests. Isso facilita a colaboração e automação de processos no repositório.

### asset-transfer-abac
Demonstra o uso de Controle de Acesso Baseado em Atributos (ABAC) para regular o acesso a ativos e dados em uma rede blockchain. O contrato inteligente define permissões com base em atributos das identidades.

### asset-transfer-basic
Um exemplo simples de um contrato inteligente que permite a criação e transferência de ativos em um ledger. Recomendado para novos usuários do Hyperledger Fabric, é o ponto de partida ideal para aprender sobre contratos inteligentes.

### asset-transfer-events
Este exemplo mostra como contratos inteligentes podem emitir eventos que são capturados por aplicativos enquanto interagem com a rede blockchain. Eventos são úteis para notificar aplicações sobre mudanças no ledger.

### asset-transfer-ledger-queries
Demonstra como realizar consultas ao ledger, incluindo consultas por intervalo e atualizações de transações, aplicáveis para bancos de dados como LevelDB e CouchDB. Também aborda o uso de índices no CouchDB.

### asset-transfer-private-data
Demonstra o uso de coleções de dados privados, permitindo que informações confidenciais sejam armazenadas fora do ledger público. Fornece controle de acesso para garantir que apenas organizações autorizadas visualizem dados específicos.

### asset-transfer-sbe
Mostra o uso do Endosso Baseado em Estado (SBE), permitindo que diferentes regras de endosso sejam aplicadas a diferentes ativos no ledger. Útil para definir políticas específicas por ativo.

### asset-transfer-secured-agreement
Um contrato inteligente mais avançado que utiliza coleções de dados privados, controle de acesso e endosso baseado em estado para transferir ativos com segurança. Exige o consentimento tanto do proprietário atual quanto do comprador.

### auction-dutch
Implementa um leilão do tipo Dutch Auction, onde múltiplos itens do mesmo tipo podem ser vendidos para vários compradores. Este exemplo inclui a possibilidade de adicionar uma organização auditora.

### auction-simple
Exemplo de um leilão simples onde os lances são mantidos privados até o fechamento do leilão. Os participantes só revelam seus lances após o término do processo de lances.

### chaincode
Contém diversos exemplos de contratos inteligentes (chaincodes) usados em tutoriais anteriores. Eles cobrem diferentes aspectos da criação de smart contracts no Hyperledger Fabric.

### ci
Pasta destinada a scripts de Integração Contínua (CI), configurando tarefas automatizadas que são executadas sempre que o código é atualizado no repositório.

### commercial-paper
Um exemplo que demonstra o uso do Hyperledger Fabric para digitalizar e emitir commercial papers (papéis comerciais), que são instrumentos financeiros para garantir financiamento de curto prazo.

### fabcar
Um exemplo clássico de contrato inteligente para o gerenciamento de veículos (carros). Embora seja um exemplo mais antigo, ele foi depreciado em favor do `asset-transfer-basic`.

### hardware-security-module
Demonstra o uso de módulos de segurança de hardware (HSM) no Hyperledger Fabric para operações criptográficas mais seguras. HSMs são usados para proteger chaves criptográficas.

### high-throughput
Demonstra como otimizar contratos inteligentes para alta capacidade de transações, evitando colisões de transações em ambientes com grande volume de operações.

### interest_rate_swaps
Exemplo de um contrato inteligente para swaps de taxa de juros. Este exemplo foi depreciado em favor de exemplos mais recentes que utilizam endosso baseado em estado e transferências de ativos mais seguras.

### off_chain_data
Demonstra como usar eventos do blockchain para construir um banco de dados off-chain, útil para relatórios e análises sem sobrecarregar a rede blockchain.

### scripts
Contém scripts auxiliares para diversas tarefas automatizadas ou de configuração no ambiente do Hyperledger Fabric.

### test-application/javascript
Exemplos de aplicações de teste que interagem com a blockchain usando o SDK JavaScript do Hyperledger Fabric.

### test-network
Fornece uma rede de teste local baseada em Docker Compose, com peers de duas organizações e um serviço de ordenação. Ideal para testar contratos inteligentes localmente.

### test-network-k8s
Exemplo de rede de teste que roda no Kubernetes, permitindo testar contratos inteligentes em um ambiente de nuvem mais próximo da realidade.

### test-network-nano-bash
Versão mínima da rede de teste, com scripts bash simples. Oferece uma maneira leve de executar testes locais de contratos inteligentes.

### token-erc-1155
Exemplo de contrato inteligente que implementa tokens fungíveis e não fungíveis seguindo o padrão ERC-1155. Permite criar e gerenciar múltiplos tipos de tokens.

### token-erc-20
Exemplo de contrato inteligente para criação e transferência de tokens fungíveis, seguindo o padrão ERC-20, amplamente utilizado para criar tokens em blockchains.

### token-erc-721
Exemplo de contrato inteligente para criação e transferência de tokens não fungíveis (NFTs), seguindo o padrão ERC-721.

### token-utxo
Exemplo de contrato inteligente que utiliza o modelo UTXO (Unspent Transaction Output) para a criação e transferência de tokens. Esse modelo é amplamente usado no Bitcoin.

---

Este arquivo oferece uma visão geral das principais pastas do projeto, ajudando a entender os diversos exemplos e ferramentas disponíveis no Hyperledger Fabric.
