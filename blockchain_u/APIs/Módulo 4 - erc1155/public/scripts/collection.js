async function selfCollection() {
  let nftTokens = await getSelfTokens();

  if (nftTokens) {
    let element = '<div class="d-flex flex-column justify-content-between p-md-1">';
    for (var key in nftTokens) {
      let tokenId = nftTokens[key][0];
      let tokenAmount =  nftTokens[key][1]
      element +=
        '<div class="card shadow-lg mt-3 mx-auto">' +
        '<div class="card-body flex-column mx-auto">' +
        '<div class="d-flex justify-content-between p-md-1">' +
        '<div class="d-flex flex-row">' +
        '<div class="align-self-center">' +
        '<i class="fa fa-money fa-4x money-icon"></i>' +
        "</div>" +
        "<div>" +
        `<button class="accordion-button" type="button" data-bs-toggle="collapse" aria-expanded="true" data-bs-target="#${tokenId.replace(
          /\s/g,
          ""
        )}" aria-controls="${tokenId}"> <h3> Token ${tokenId}  </h3> </button>` +
        `Quantidade: ${tokenAmount}` +
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
    console.log("HTTP Error ", response.status);
    return null;
  }
}

async function getSelfTokens() {
  let token = localStorage.getItem("token");
  let headers = new Headers();
  headers.append("Authorization", "Bearer " + token);
  let url = "http://localhost:4000/query/channels/channel1/chaincodes/chaincode/selfCollection";
  var init = {
    method: "GET",
    headers: headers,
  };

  let response = await fetch(url, init);
  let result = (await response.json())?.result;

  return result //array
}

async function collection() {
  event.preventDefault();
  let nftTokens = await getTokens();
  console.log(nftTokens)

  if (nftTokens) {
    let element = '<div class="d-flex flex-column justify-content-between p-md-1">';
    for (var key in nftTokens) {
      let tokenId = nftTokens[key][0];
      let tokenAmount =  nftTokens[key][1]
      element +=
        '<div class="card shadow-lg mt-3 mx-auto">' +
        '<div class="card-body flex-column mx-auto">' +
        '<div class="d-flex justify-content-between p-md-1">' +
        '<div class="d-flex flex-row">' +
        '<div class="align-self-center">' +
        '<i class="fa fa-money fa-4x money-icon"></i>' +
        "</div>" +
        "<div>" +
        `<button class="accordion-button" type="button" data-bs-toggle="collapse" aria-expanded="true" data-bs-target="#${tokenId.replace(
          /\s/g,
          ""
        )}" aria-controls="${tokenId}"> <h3> Token ${tokenId}  </h3> </button>` +
        `Quantidade: ${tokenAmount}` +
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
  } 
  else {
    console.log("HTTP Error ", response.status);
    return null;
  }
}

async function getTokens() {
  let tokenOwnerOrg = document.getElementById("tokenOwnerOrg").value;
  let tokenOwner = document.getElementById("tokenOwner").value;

  console.log(tokenOwner,tokenOwnerOrg)

  let token = localStorage.getItem("token");

  let headers = new Headers();
  headers.append("Authorization", "Bearer " + token);
  let url = `http://localhost:4000/query/channels/channel1/chaincodes/chaincode/collection?tokenOwner=${tokenOwner}&tokenOwnerOrg=${tokenOwnerOrg}`;
  var init = {
    method: "GET",
    headers: headers,
  };

  let response = await fetch(url, init);
  let result = (await response.json())?.result;

  return result //array
}