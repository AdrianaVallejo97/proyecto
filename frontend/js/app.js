const API_BACK = "/api";
const user = localStorage.getItem('pokemon_user') || 'Invitado';
window.addEventListener('load', () => {
  if (!localStorage.getItem('pokemon_user')) location.href = 'index.html';
});

document.getElementById('logout').addEventListener('click', () => {
  localStorage.removeItem('pokemon_user');
  location.href = 'index.html';
});

document.getElementById('searchBtn').addEventListener('click', async () => {
  const name = document.getElementById('searchInput').value.trim().toLowerCase();
  if (!name) return alert('Escribe el nombre de un Pokémon');

  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  if (!res.ok) {
    document.getElementById('result').innerHTML = '<p>Pokémon no encontrado</p>';
  } else {
    const data = await res.json();
    const types = data.types.map(t => t.type.name).join(', ');
    const abilities = data.abilities.map(a => a.ability.name).join(', ');

    document.getElementById('result').innerHTML = `
      <div class="pokemon-card">
        <h2>¡Bienvenido, ${user}!</h2>
        <h2>${data.name}</h2>
        <img src="${data.sprites.front_default}" alt="${data.name}" />
        <p>Tipo: ${types}</p>
        <p>Habilidades: ${abilities}</p>
      </div>
    `;

    // Guardar en base de datos
    await fetch(API_BACK + '/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        searchTerm: name,
        sprite: data.sprites.front_default,
        types,
        abilities
      })
    });

    loadHistory();
  }
});

async function loadHistory() {
  const res = await fetch(API_BACK + '/search');
  const items = await res.json();
  const container = document.getElementById('historyList');

  container.innerHTML = "";

  items.forEach(p => {
    const div = document.createElement('div');
    div.className = "history-card";
    div.innerHTML = `
      <img src="${p.sprite}" alt="${p.term}">
      <h3>${p.term}</h3>
      <p><strong>Tipo:</strong> ${p.types}</p>
      <p><strong>Habilidades:</strong> ${p.abilities}</p>
      <p>${new Date(p.date).toLocaleString()}</p>
    `;
    container.appendChild(div);
  });
}

loadHistory();
