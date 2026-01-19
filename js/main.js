// Busca en el HTML el elemento donde vamos a meter las tarjetas
const listPokemon = document.querySelector('#listPokemon');
// Busca todos los botones que estan en la cabecera para filtrar
const btnHeader = document.querySelectorAll('.btn-header');

// Guardamos la direccion base de donde vamos a sacar la informacion
let url = 'https://pokeapi.co/api/v2/pokemon/';

// Hacemos un ciclo que se repite 151 veces
for (let i = 1; i <= 151; i++) {
  // Pedimos a internet la info del pokemon numero i
  fetch(url + i)
    // Cuando responde, convertimos la respuesta a datos legibles
    .then((response) => response.json())
    // Cuando tenemos los datos, los mandamos a la funcion que dibuja la tarjeta
    .then((data) => showPokemon(data));
}

// Esta es la funcion encargada de crear el HTML de cada tarjeta
function showPokemon(data) {
  // Crea una cajita vacia (div) en memoria
  const div = document.createElement('div');

  // Recorre los tipos del pokemon y crea un parrafo HTML para cada uno
  let types = data.types.map(
    (type) => `<p class="type ${type.type.name}">${type.type.name}</p>`,
  );
  // Junta todos esos parrafos en un solo texto seguido
  types = types.join('');
  //   console.log(types);
  // console.log(types.type);

  // Convierte el numero ID del pokemon a texto
  let idPokemon = data.id.toString();
  // Si el ID tiene solo 1 digito, le agregamos dos ceros al inicio
  if (idPokemon.length === 1) {
    idPokemon = '00' + idPokemon;
  // Si el ID tiene 2 digitos, le agregamos un cero al inicio
  } else if (idPokemon.length === 2) {
    idPokemon = '0' + idPokemon;
  }

  // Le ponemos la clase 'pokemon' a la cajita para que tenga estilo
  div.classList.add('pokemon');
  // Rellenamos la cajita con todo el HTML: imagen, nombre, ID y stats
  div.innerHTML = `
            <p class="pokemon-id-back">#${idPokemon}</p>
            <div class="pokemon-img">
              <img
                src="${data.sprites.other['official-artwork'].front_default}"
                alt="${data.name}"
              />
            </div>
            <div class="pokemon-info">
              <div class="name-container">
                <p class="pokemon-id">#${idPokemon}</p>
                <h2 class="name-pokemon">${data.name}</h2>
              </div>
              <div class="pokemon-types">
                ${types}
              </div>
              <div class="pokemon-stats">
                <p class="height">${(data.height * 0.1).toFixed(2)}M</p>
                <p class="weight">${(data.weight * 0.1).toFixed(2)}KG</p>
              </div>
            </div>
    `;

  // Agregamos la cajita terminada al contenedor principal en la pantalla
  listPokemon.append(div);
}

// Recorremos cada boton del menu de arriba
btnHeader.forEach((btn) =>
  // Le ponemos una oreja para escuchar cuando le hagan click
  btn.addEventListener('click', (event) => {
    // Guardamos el ID del boton que fue presionado (ej: "fuego")
    const btnId = event.currentTarget.id;

    // Borramos todo lo que hay actualmente en la pantalla
    listPokemon.innerHTML = ''

    // Volvemos a recorrer los 151 pokemon
    for (let i = 1; i <= 151; i++) {
      // Pedimos los datos de nuevo a internet
      fetch(url + i)
        .then((response) => response.json())
        .then((data) => {
            // Si el boton presionado fue "ver todos"
            if(btnId === 'watch-all') {
                // Dibujamos el pokemon sin preguntar mas
                showPokemon(data)
            } else {
                // Si no, sacamos una lista con los nombres de los tipos de este pokemon
                const types = data.types.map(type => type.type.name);
                // Si alguno de sus tipos coincide con el boton presionado
                if(types.some(type => type.includes(btnId))) {
                    // Entonces si lo dibujamos
                    showPokemon(data)
                }
            }
        });
    }
  }),
);