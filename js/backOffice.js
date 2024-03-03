//Back Office

// URL e API KEY
const url = "https://striveschool-api.herokuapp.com/api/product/";
const myKey =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWUxYTFjNjRjNTllYzAwMTk5MGQ3MTUiLCJpYXQiOjE3MDkyODU4MzAsImV4cCI6MTcxMDQ5NTQzMH0.r8huHjCZmpzbaiE9zOVPC04JRHlLwJ_j1GxuMOqITyQ";

// richiamo gli elementi chiave dell'HTML
const form = document.getElementById("backOfficeForm");
const modifyButton = document.getElementById("modifyButton");
const createButton = document.getElementById("createButton");

// Carico la pagina con i dati se presenti
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
  // avvio la funzione che alterna i tasti di submit e che mostra o no l'input con l'ID
  hideOrSeen();
});

// avvio il submit del form che avrà due funzioni

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const productId = document.getElementById("productId").value;
  const productData = {
    name: document.getElementById("nameProduct").value,
    description: document.getElementById("description").value,
    brand: document.getElementById("brand").value,
    imageUrl: document.getElementById("imgProduct").value,
    price: document.getElementById("price").value,
  };
  // se è presente il mio ID vuol dire che stiamo cercando di modificare un prodotto
  // e attiverà la funzione di modifica
  if (productId) {
    modifyProduct(productId, productData);
  } else {
    // altrimenti ne crea uno nuovo
    createNewProduct(productData);
  }
});

// funziona di creazione prodotto
function createNewProduct(productData) {
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
}

// funzione di modifica prodotto
function modifyProduct(productId, productData) {
  console.log("Product Data:", productData);

  fetch(`${url}${productId}`, {
    method: "PUT",
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
    .then((modifiedProduct) => {
      if (modifiedProduct) {
        alert("Il prodotto è stato modificato con successo ");
      } else {
        alert("Il prodotto non è stato modificato correttamente");
      }
    })
    .catch((err) => console.log(err));
}

// funzione che mi permette di alternare i button e l'input ID
const hideOrSeen = () => {
  const productIdInput = document.getElementById("productId");
  const parentDiv = productIdInput.closest(".input-group");

  if (productIdInput.value === "") {
    parentDiv.classList.add("d-none");
    modifyButton.classList.add("d-none");
    createButton.classList.remove("d-none");
  } else if (productIdInput.value === localStorage.getItem("selectedProductId")) {
    parentDiv.classList.remove("d-none");
    createButton.classList.add("d-none");
    modifyButton.classList.remove("d-none");
  }
};

// implemento il pulsante di reset

const resetButton = document.getElementById("resetForm");

// creo un alert che previene eventuali errori
resetButton.addEventListener("click", function () {
  const userResponse = window.confirm(
    "Sei sicuro/a di voler resettare il form? Digita 'OK' per confermare o 'Annulla' per annullare."
  );

  if (userResponse) {
    resetForm();
  } else {
    alert("Reset annullato");
  }
});

// effettiva pulizia del form che mi fa tornare alla modalità crea
function resetForm() {
  localStorage.removeItem("selectedProductId");
  localStorage.removeItem("selectedProductName");
  localStorage.removeItem("selectedProductBrand");
  localStorage.removeItem("selectedProductDescription");
  localStorage.removeItem("selectedProductPrice");

  form.reset();

  hideOrSeen();
}
