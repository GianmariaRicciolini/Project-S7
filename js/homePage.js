//Home Page

// URL e API KEY
const url = "https://striveschool-api.herokuapp.com/api/product/";
const myKey =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWUxYTFjNjRjNTllYzAwMTk5MGQ3MTUiLCJpYXQiOjE3MDkyODU4MzAsImV4cCI6MTcxMDQ5NTQzMH0.r8huHjCZmpzbaiE9zOVPC04JRHlLwJ_j1GxuMOqITyQ";

document.addEventListener("DOMContentLoaded", function () {
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
      // attiva la funzione che mette le card create nell'HTML
      createAndAppendCards(products);
    })
    .catch((err) => {
      console.error("Errore durante il recupero dei dati:", err);
    });
});

const createAndAppendCards = (products) => {
  const cardContainer = document.getElementById("card-container");

  products.forEach((product) => {
    // per ogni prodotto crea una carta con i suoi valori
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
              <h2 class="card-title nameProduct">${product.name}</h2>
              <h6 class="card-title brand">${product.brand}</h6>
              <p class="card-text description">${product.description}</p>
              <p class="card-text price">Prezzo: ${product.price} €</p>
              <p class="card-text productId d-none">${product._id}</p>
              <div class="text-end">
                <button class="btn btn-warning d-none" onclick="modifyProduct(event)">
                  <a class="link-dark link-underline link-underline-opacity-0" href="./backOffice.html">Modify</a>
                </button>
                <button class="btn btn-danger d-none" onclick="confirmDelete(event)")">Delete</button>
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

// creo un sistema di sicurezza che prevenga l'eliminazione accidentale
const confirmDelete = (event) => {
  const productId = event.target.getAttribute("data-product-id");
  const card = event.target.closest(".card");

  const userResponse = window.confirm(
    "Proprio sicurissimo/a di voler eliminare questo prodotto?? Digita 'OK' per confermare o 'Annulla' per annullare."
  );

  if (userResponse) {
    deleteProduct(productId);
    card.remove();
  } else {
    alert("Eliminazione annullata");
  }
};

//aggiungo la possibilità di avere due modalità per l'utilizzo dei button

const switchModeButton = document.getElementById("switchMode");
switchModeButton.addEventListener("click", switchMode);

// questa funzione permette di vedere i button di modifica ed elimina entrando in una ipotetica
// "admin mode" e inverte il testo del button per indicare di tornare alla "normal mode" senza button
function switchMode() {
  const cardContainer = document.getElementById("card-container");
  const backOfficeButton = document.getElementById("changePage");
  const normalMode = switchModeButton.innerText === "Normal Mode";
  const adminMode = switchModeButton.innerText === "Admin Mode";

  const buttons = cardContainer.querySelectorAll(".card .text-end button");

  if (normalMode) {
    // Torna alla modalità utente (visualizza le carte senza i bottoni "Modify" e "Delete")
    switchModeButton.innerText = "Admin Mode";
    backOfficeButton.classList.add("d-none");
  } else if (adminMode) {
    // Passa alla modalità admin (visualizza le carte con i bottoni "Modify" e "Delete")
    switchModeButton.innerText = "Normal Mode";
    backOfficeButton.classList.remove("d-none");
  }
  buttons.forEach((button) => {
    if (normalMode) {
      button.classList.add("d-none");
    } else if (adminMode) {
      button.classList.remove("d-none");
    }
  });
}

// aggiungo funzionalità al button modify per collegarlo anche al back office

const modifyProduct = (event) => {
  const cardElement = event.target.closest(".card");

  // richiamo i valori
  const productId = cardElement.querySelector(".productId").textContent;
  const productName = cardElement.querySelector(".nameProduct").textContent;
  const productBrand = cardElement.querySelector(".brand").textContent;
  const productDescription = cardElement.querySelector(".description").textContent;
  const productPrice = cardElement.querySelector(".price").textContent;

  // pulisco lo storage dai vecchi dati
  localStorage.clear();

  // carico i nuovi dati sul local storage
  localStorage.setItem("selectedProductId", productId);
  localStorage.setItem("selectedProductName", productName);
  localStorage.setItem("selectedProductBrand", productBrand);
  localStorage.setItem("selectedProductDescription", productDescription);
  localStorage.setItem("selectedProductPrice", productPrice);
};
