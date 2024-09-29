async function mint() {
  event.preventDefault();

  document.getElementById("loader").style.display = "flex";
  document.getElementById("submitButton").style.display = "none";

  let username = document.getElementById("username").value;
  let id = document.getElementById("id").value;
  let qty = document.getElementById("qty").value;
  let tokenReceiverOrg = document.getElementById("tokenReceiverOrg").value;
  const disciplina = document.getElementById("disciplina").value;
  const atividade = document.getElementById("atividade").value;
  const periodo = document.getElementById("periodo").value;
  const resolucao = document.getElementById("resolucao").value;

  let token = localStorage.getItem("token");

  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", "Bearer " + token);
  let url =
    "http://localhost:4000/invoke/channels/channel1/chaincodes/chaincode/mint";

  var init = {
    method: "POST",
    headers: headers,
  };

  body = {
    tokenId: id === "usp" ? id : "nft",
    tokenAmount: qty,
    tokenReceiver: username,
    tokenReceiverOrg,
    disciplina,
    atividade,
    periodo,
    resolucao,
  };

  init.body = JSON.stringify(body);

  let response = await fetch(url, init);

  if (response.ok) {
    response = await response.json();
    if (response.result != "success") {
      document.getElementById("submitButton").style.display = "flex";
      document.getElementById("loader").style.display = "none";
      element =
        `<div class="alert alert-danger alert-dismissible fade show mb-3 mt-3" role="alert">` +
        `Ocorreu um erro na emissao` +
        `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>` +
        `</div>`;
      document.getElementById("flash").innerHTML = element;
    } else {
      document.getElementById("submitButton").style.display = "flex";
      document.getElementById("loader").style.display = "none";
      element =
        `<div class="alert alert-success alert-dismissible fade show mb-3 mt-3" role="alert">` +
        `Emissão realizada com sucesso` +
        `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>` +
        `</div>`;
      document.getElementById("flash").innerHTML = element;
    }
  } else {
    console.log("HTTP Error ", response.status);
    document.getElementById("submitButton").style.display = "flex";
    document.getElementById("loader").style.display = "none";
    element =
      `<div class="alert alert-danger alert-dismissible fade show mb-3 mt-3" role="alert">` +
      `Ocorreu um erro na emissão` +
      `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>` +
      `</div>`;
    document.getElementById("flash").innerHTML = element;
    return null;
  }
}

function uspDisplay() {
  id.value = "usp";
  qty.value = "";
  metadata.hidden = true;
  disciplina.required = false;
  atividade.required = false;
  periodo.required = false;
  resolucao.required = false;
  disciplina.value = "";
  atividade.value = "";
  periodo.value = "";
  resolucao.value = "";
}

function nftDisplay() {
  id.value = "(sha-256 do token)";
  qty.value = 1;
  metadata.hidden = false;
  disciplina.required = true;
  atividade.required = true;
  periodo.required = true;
  resolucao.required = true;
}
