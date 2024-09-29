let collectionArray = [];

async function selfCollection() {
  let nftTokens = await getSelfTokens();

  if (nftTokens) {
    let element =
      '<div class="d-flex flex-column justify-content-between p-md-1">';
    for (var key in nftTokens) {
      let tokenId = nftTokens[key][0];
      let tokenAmount = nftTokens[key][1];
      let metadata = JSON.parse(nftTokens[key][2]);
      const disciplina = metadata.disciplina;
      const atividade = metadata.atividade;
      const periodo = metadata.periodo;
      const resolucao = metadata.resolucao;

      element +=
        '<div class="card shadow-lg mt-3 mx-auto">' +
        '<div class="card-body flex-column mx-auto">' +
        '<div class="d-flex justify-content-between p-md-1">' +
        '<div class="d-flex flex-row">' +
        '<div class="align-self-center">' +
        // '<i class="fa fa-money fa-4x money-icon"></i>' +
        "</div>" +
        "<div>" +
        `<button class="accordion-button" type="button" data-bs-toggle="collapse" aria-expanded="true" data-bs-target="#${disciplina.replace(
          /\s/g,
          ""
        )}" aria-controls="${disciplina}"> <h3>${disciplina}  </h3> </button>` +
        `<h6><strong>Atividade</strong>: ${atividade}</h6>` +
        `<h6><strong>Período</strong>: ${periodo}</h6>` +
        `<h6><strong>Resolução</strong>: ${resolucao}</h6>` +
        `<br><spam class="token-info"><strong>Quantidade do Token</strong>: ${tokenAmount}<br>` +
        `<strong>ID do Token</strong>: ${tokenId}</spam>` +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>";

      // Renderizar a cada nft carregado
      document.getElementById("nft-showroom").innerHTML = element;
    }
    //Desabilitar gif do loader
    document.getElementById("loader").style.display = "none";
  } else {
    //Desabilitar gif do loader
    document.getElementById("loader").style.display = "none";
    console.log("HTTP Error ", response.status);
    return null;
  }
}

async function getSelfTokens() {
  let token = localStorage.getItem("token");
  let headers = new Headers();
  headers.append("Authorization", "Bearer " + token);
  let url =
    "http://localhost:4000/query/channels/channel1/chaincodes/chaincode/selfCollection";
  var init = {
    method: "GET",
    headers: headers,
  };

  let response = await fetch(url, init);
  let result = (await response.json())?.result;

  return result; //array
}

// async function collection() {
//   event.preventDefault();
//   let nftTokens = await getTokens();

//   if (nftTokens) {
//     let element =
//       '<div class="d-flex flex-column justify-content-between p-md-1">';
//     for (var key in nftTokens) {
//       let tokenId = nftTokens[key][0];
//       let tokenAmount = nftTokens[key][1];
//       element +=
//         '<div class="card shadow-lg mt-3 mx-auto">' +
//         '<div class="card-body flex-column mx-auto">' +
//         '<div class="d-flex justify-content-between p-md-1">' +
//         '<div class="d-flex flex-row">' +
//         '<div class="align-self-center">' +
//         '<i class="fa fa-money fa-4x money-icon"></i>' +
//         "</div>" +
//         "<div>" +
//         `<button class="accordion-button" type="button" data-bs-toggle="collapse" aria-expanded="true" data-bs-target="#${tokenId.replace(
//           /\s/g,
//           ""
//         )}" aria-controls="${tokenId}"> <h3> Token ${tokenId}  </h3> </button>` +
//         `Quantidade: ${tokenAmount}` +
//         "</div>" +
//         "</div>" +
//         "</div>" +
//         "</div>" +
//         "</div>" +
//         "</div>";

//       // Renderizar a cada nft carregado
//       document.getElementById("nft-showroom").innerHTML = element;
//     }
//     //Desabilitar gif do loader
//     document.getElementById("loader").style.display = "none";
//   } else {
//     console.log("HTTP Error ", response.status);
//     return null;
//   }
// }

async function collection() {
  let nftTokens = await getTokens();

  if (nftTokens) {
    let element =
      '<div class="d-flex flex-column justify-content-between p-md-1">';
    for (var key in nftTokens) {
      let tokenId = nftTokens[key][0];
      let tokenAmount = nftTokens[key][1];
      let metadata = JSON.parse(nftTokens[key][2]);
      const disciplina = metadata.disciplina;
      const atividade = metadata.atividade;
      const periodo = metadata.periodo;
      const resolucao = metadata.resolucao;
      const ownerId = nftTokens[key][3];

      collectionArray.push({ ownerId, tokenId });

      element +=
        '<div class="card shadow-lg mt-3 mx-auto">' +
        '<div class="card-body flex-column mx-auto">' +
        '<div class="d-flex justify-content-between p-md-1">' +
        '<div class="d-flex flex-row">' +
        '<div class="align-self-center">' +
        // '<i class="fa fa-money fa-4x money-icon"></i>' +
        "</div>" +
        "<div>" +
        `<button class="accordion-button" type="button" data-bs-toggle="collapse" aria-expanded="true" data-bs-target="#${disciplina.replace(
          /\s/g,
          ""
        )}" aria-controls="${disciplina}"> <h3>${disciplina}  </h3> </button>` +
        `<h6><strong>Atividade</strong>: ${atividade}</h6>` +
        `<h6><strong>Período</strong>: ${periodo}</h6>` +
        `<h6><strong>Resolução</strong>: ${resolucao}</h6>` +
        `<br><spam class="token-info"><strong>Quantidade do Token</strong>: ${tokenAmount}<br>` +
        `<strong>ID do Token</strong>: ${tokenId}</spam>` +
        `<button id="submitCompensationButton" type="submit" style="display: flex" class="btn btn-primary btn-md mt-3" onclick="buyNFT('${tokenId}')">Comprar</button>` +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>";

      // Renderizar a cada nft carregado
      document.getElementById("nft-showroom").innerHTML = element;
    }
    //Desabilitar gif do loader
    document.getElementById("loader").style.display = "none";
  } else {
    //Desabilitar gif do loader
    document.getElementById("loader").style.display = "none";
    return null;
  }
}

async function getTokens() {
  let jwt = localStorage.getItem("token");

  let headers = new Headers();
  headers.append("Authorization", "Bearer " + jwt);
  let url = `http://localhost:4000/query/channels/channel1/chaincodes/chaincode/collection`;
  var init = {
    method: "GET",
    headers: headers,
  };

  let response = await fetch(url, init);

  let result = (await response.json())?.result;

  return result; //array
}

async function buyNFT(tokenId) {
  event.preventDefault();

  //set loading
  document.getElementById("loader").style.display = "flex";
  document.getElementById("submitCompensationButton").style.display = "none";

  let jwt = localStorage.getItem("token");

  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", "Bearer " + jwt);
  let url = `http://localhost:4000/invoke/channels/channel1/chaincodes/chaincode/buyNFT`;

  var init = {
    method: "POST",
    headers: headers,
  };

  //get token owner
  let tokenInfo = collectionArray.filter(
    (collectionArray) => collectionArray.tokenId === tokenId
  );
  tokenOwnerId = tokenInfo[0].ownerId;

  let body = {
    tokenId,
    tokenOwnerId,
  };

  init.body = JSON.stringify(body);

  //POST to postMetadata
  let response = await fetch(url, init);

  //Desabilitar gif do loader
  document.getElementById("loader").style.display = "none";

  if (response.ok) {
    response = await response.json();
    if (response.result != "success") {
      let element =
        `<div class="alert alert-danger alert-dismissible fade show mb-3 mt-3" role="alert">` +
        `Ocorreu um erro na compra` +
        `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>` +
        `</div>`;
      document.getElementById("flash").innerHTML = element;
    } else {
      let element =
        `<div class="alert alert-success alert-dismissible fade show mb-3 mt-3" role="alert">` +
        `Comprado com sucesso` +
        `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>` +
        `</div>`;
      document.getElementById("flash").innerHTML = element;
    }
    window.location.href = `/collection`;
  } else {
    console.log("HTTP Error ", response.status);
    let element =
      `<div class="alert alert-danger alert-dismissible fade show mb-3 mt-3" role="alert">` +
      `Ocorreu um erro na compra` +
      `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>` +
      `</div>`;
    document.getElementById("flash").innerHTML = element;
    return null;
  }
}
