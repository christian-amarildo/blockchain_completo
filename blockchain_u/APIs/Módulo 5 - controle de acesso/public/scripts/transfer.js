async function transfer() {
  event.preventDefault();

  document.getElementById("loader").style.display = "flex";
  document.getElementById("submitButton").style.display = "none";

  let usernameDest = document.getElementById("usernameDest").value;
  let tokenId = document.getElementById("tokenId").value;
  let qty = document.getElementById("qty").value;
  let tokenReceiverOrg = document.getElementById("tokenReceiverOrg").value;

  let token = localStorage.getItem("token");  

  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", "Bearer " + token);
  let url = "http://localhost:4000/invoke/channels/channel1/chaincodes/chaincode/transfer";

  var init = {
    method: "POST",
    headers: headers,
  };

  body = {
    tokenId,
    tokenAmount: qty,
    tokenReceiver: usernameDest,
    tokenReceiverOrg
  };

  init.body = JSON.stringify(body);

  let response = await fetch(url, init);

  if (response.ok) {
    response = await response.json();
    if (response.result == null){
      document.getElementById("submitButton").style.display = "flex";
      document.getElementById("loader").style.display = "none";
      element =     
      `<div class="alert alert-danger alert-dismissible fade show mb-3 mt-3" role="alert">`+
          `Ocorreu um erro na transferencia`+
          `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`+
      `</div>`
      document.getElementById("flash").innerHTML = element;
    }
    else {
      document.getElementById("submitButton").style.display = "flex";
      document.getElementById("loader").style.display = "none";
      element =     
      `<div class="alert alert-success alert-dismissible fade show mb-3 mt-3" role="alert">`+
          `Transferencia realizada com sucesso`+
          `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`+
      `</div>`
    document.getElementById("flash").innerHTML = element;
    }
  } else {
    console.log("HTTP Error ", response.status);
    document.getElementById("submitButton").style.display = "flex";
    document.getElementById("loader").style.display = "none";
    element =     
    `<div class="alert alert-danger alert-dismissible fade show mb-3 mt-3" role="alert">`+
        `Ocorreu um erro na transferência`+
        `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`+
    `</div>`
    document.getElementById("flash").innerHTML = element;
    return null;
  }
}
