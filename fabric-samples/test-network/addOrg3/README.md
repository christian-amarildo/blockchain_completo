## Adicionando Org3 à rede de teste

Você pode usar o script `addOrg3.sh` para adicionar outra organização à rede de teste do Fabric. O script `addOrg3.sh` gera o material criptográfico Org3, cria uma definição de organização Org3 e adiciona Org3 a um canal na rede de teste.

Primeiro, você precisa executar `./network.sh up createChannel` no diretório `test-network` antes de poder executar o script `addOrg3.sh`.

```
./network.sh up createChannel
cd addOrg3
./addOrg3.sh up
```

Se você usou `network.sh` para criar um canal diferente do `mychannel` padrão, você precisa passar esse nome para o script `addorg3.sh`.
```
./network.sh up createChannel -c channel1
cd addOrg3
./addOrg3.sh up -c channel1
```

Você também pode executar novamente o script `addOrg3.sh` para adicionar Org3 a canais adicionais.
```
cd ..
./network.sh createChannel -c channel2
cd addOrg3
./addOrg3.sh up -c channel2
```

Para obter mais informações, use `./addOrg3.sh -h` para ver o texto de ajuda `addOrg3.sh`.
