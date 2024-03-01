//Home Page

const url = "https://striveschool-api.herokuapp.com/api/product/";
const myKey =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWUxYTFjNjRjNTllYzAwMTk5MGQ3MTUiLCJpYXQiOjE3MDkyODU4MzAsImV4cCI6MTcxMDQ5NTQzMH0.r8huHjCZmpzbaiE9zOVPC04JRHlLwJ_j1GxuMOqITyQ";

document.addEventListener("DOMContentLoaded", function () {
  // Verifica se l'URL corrente corrisponde all'URL della home page
  getProductData();
});
const getProductData = () => {
  fetch(url, {
    headers: {
      Authorization: myKey,
    },
  })
    .then((response) => {
      console.log(response);

      if (!response.ok) {
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

      return response.json();
    })
    .then((products) => {
      createAndAppendCards(products);
    })
    .catch((err) => {
      console.error("Errore durante il recupero dei dati:", err);
    });
};

const createAndAppendCards = (products) => {
  const cardContainer = document.getElementById("card-container");

  products.forEach((product) => {
    const card = createProductCard(product);
    cardContainer.appendChild(card);
  });
};

const createProductCard = (product) => {
  const card = document.createElement("div");
  card.classList.add("col-12", "col-sm-6", "col-md-4", "col-xl-3", "mb-4");

  card.innerHTML = `
      <div class="card d-flex">
          <img src="${product.imageUrl}" class="card-img-top img-fluid" alt="${product.name}" style="object-fit: cover; height: 500px;">
          <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">${product.description}</p>
              <p class="card-text">Prezzo: ${product.price} €</p>
              <div class="text-end">
                  <button href="productDetail.html?id=${product._id}" class="d-none btn btn-warning">Modify</button>
                  <button class="btn btn-danger d-none" onclick="confirmDelete('${product._id}')">Delete</button>
              </div>
          </div>
      </div>
    `;
  return card;
};

// Aggiungere funzione di eliminare il prodotto al button Delete

const deleteProduct = (productId) => {
  const deleteUrl = `${url}${productId}`;

  fetch(deleteUrl, {
    method: "DELETE",
    headers: {
      Authorization: myKey,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Errore nella richiesta: ${response.statusText}`);
      }
      console.log(`Prodotto con ID ${productId} eliminato con successo`);
    })
    .catch((error) => console.error("Errore durante la cancellazione del prodotto:", error));
};

const confirmDelete = (productId) => {
  const userResponse = window.confirm(
    "Proprio sicurissimo/a di voler eliminare questo prodotto?? Digita 'OK' per confermare o 'Annulla' per annullare."
  );

  if (userResponse) {
    deleteProduct(productId);
  } else {
    alert("Eliminazione annullata");
  }
};

//aggiungo la possibilità di avere due modalità per l'utilizzo dei button

const switchModeButton = document.getElementById("switchMode");
switchModeButton.addEventListener("click", switchMode);

function switchMode() {
  const cardContainer = document.getElementById("card-container");
  const normalMode = switchModeButton.innerText === "Normal Mode";
  const adminMode = switchModeButton.innerText === "Admin Mode";

  const buttons = cardContainer.querySelectorAll(".card .text-end button");

  if (normalMode) {
    // Torna alla modalità utente (visualizza le carte senza i bottoni "Modify" e "Delete")
    switchModeButton.innerText = "Admin Mode";
  } else if (adminMode) {
    // Passa alla modalità admin (visualizza le carte con i bottoni "Modify" e "Delete")
    switchModeButton.innerText = "Normal Mode";
  }
  buttons.forEach((button) => {
    if (normalMode) {
      button.classList.add("d-none");
    } else if (adminMode) {
      button.classList.remove("d-none");
    }
  });
}
