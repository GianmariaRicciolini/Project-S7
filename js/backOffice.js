//Back Office
const url = "https://striveschool-api.herokuapp.com/api/product/";
const myKey =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWUxYTFjNjRjNTllYzAwMTk5MGQ3MTUiLCJpYXQiOjE3MDkyODU4MzAsImV4cCI6MTcxMDQ5NTQzMH0.r8huHjCZmpzbaiE9zOVPC04JRHlLwJ_j1GxuMOqITyQ";

const form = document.getElementById("backOfficeForm");

document.addEventListener("DOMContentLoaded", function () {
  // Controlla se ci sono dati nello storage
  if (localStorage.getItem("selectedProductId")) {
    // Compila il form con i dati presenti nello storage
    document.getElementById("productId").value = localStorage.getItem("selectedProductId");
    document.getElementById("nameProduct").value = localStorage.getItem("selectedProductName");
    document.getElementById("brand").value = localStorage.getItem("selectedProductBrand");
    document.getElementById("description").value = localStorage.getItem("selectedProductDescription");
    document.getElementById("price").value = localStorage.getItem("selectedProductPrice");
  }
  hideOrSeen();
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const productData = {
    name: document.getElementById("nameProduct").value,
    description: document.getElementById("description").value,
    brand: document.getElementById("brand").value,
    imageUrl: document.getElementById("imgProduct").value,
    price: document.getElementById("price").value,
  };
  console.log(productData);

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: myKey,
    },
    body: JSON.stringify(productData),
  })
    .then((response) => {
      console.log(response);

      if (response.ok) {
        return response.json();
      } else {
        if (response.status === 400) {
          throw new Error("400 - Errore lato client");
        }

        if (response.status === 404) {
          throw new Error("404 - Dato non trovato");
        }

        if (response.status === 500) {
          throw new Error("500 - Errore lato server");
        }

        throw new Error("Errore nel reperimento dati");
      }
    })
    .then((newProduct) => {
      if (newProduct) {
        alert("Il prodotto è stato aggiunto con successo ");
      } else {
        alert("Il prodotto non è stato creato correttamente");
        e.target.reset();
      }
    })
    .catch((err) => console.log(err));
});
// Nascondo e mostro la voce del form ID se ho i valori nel local storage

const hideOrSeen = () => {
  const productIdInput = document.getElementById("productId");
  const parentDiv = productIdInput.closest(".input-group");
  if (productIdInput.value === "") {
    parentDiv.classList.add("d-none");
  } else if (productIdInput.value === localStorage.getItem("selectedProductId")) {
    parentDiv.classList.remove("d-none");
  }
};
