const HOUSES_KEY = 'houses';
const FAVORITES_KEY = 'favorite_houses';

/* ---------------- HOUSES ---------------- */
class HousesStore {
  static getAll() {
    return JSON.parse(localStorage.getItem(HOUSES_KEY) || '[]');
  }

  static saveAll(houses) {
    localStorage.setItem(HOUSES_KEY, JSON.stringify(houses));
  }

  static add(house) {
    const houses = this.getAll();
    houses.push(house);
    this.saveAll(houses);
  }

  static remove(id) {
    const houses = this.getAll().filter(h => h.id !== id);
    this.saveAll(houses);
  }
}

/* ---------------- FAVORITES ---------------- */
class FavoritesStore {
  static getAll() {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  }

  static toggle(id) {
    let favs = this.getAll();
    favs = favs.includes(id)
      ? favs.filter(f => f !== id)
      : [...favs, id];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  }

  static isFavorite(id) {
    return this.getAll().includes(id);
  }
}

/* ---------------- ADD HOUSE ---------------- */
const houseForm = document.getElementById('houseForm');
if (houseForm) {
  houseForm.addEventListener('submit', e => {
    e.preventDefault();
    const user = Auth.getCurrentUser();
    if (!user || user.role !== 'owner') return alert('Only owners allowed');

    const house = {
      id: Date.now(),
      ownerEmail: user.email,
      title: title.value,
      location: location.value,
      rent: rent.value,
      type: type.value,
      amenities: amenities.value,
      description: description.value
    };

    HousesStore.add(house);
    alert('House added');
    window.location.href = 'dashboard.html';
  });
}

/* ---------------- OWNER DASHBOARD ---------------- */
function renderOwnerHouses() {
  const el = document.getElementById('ownerHouses');
  if (!el) return;

  const user = Auth.getCurrentUser();
  const houses = HousesStore.getAll().filter(
    h => h.ownerEmail === user.email
  );

  el.innerHTML = '';
  houses.forEach(h => {
    el.innerHTML += `
      <div class="property-card">
        <h3>${h.title}</h3>
        <p>${h.location}</p>
        <p>₹${h.rent}</p>
        <button onclick="deleteHouse(${h.id})">Delete</button>
      </div>`;
  });
}

function deleteHouse(id) {
  if (confirm('Delete this house?')) {
    HousesStore.remove(id);
    renderOwnerHouses();
  }
}

/* ---------------- TENANT DASHBOARD ---------------- */
function renderTenantHouses() {
  const el = document.getElementById('tenantHouses');
  if (!el) return;

  const houses = HousesStore.getAll();
  el.innerHTML = '';

  houses.forEach(h => {
    el.innerHTML += `
      <div class="property-card">
        <h3>${h.title}</h3>
        <p>${h.location}</p>
        <p>₹${h.rent}</p>
        <button onclick="toggleFavorite(${h.id})">
          ${FavoritesStore.isFavorite(h.id) ? '❤️ Saved' : '🤍 Save'}
        </button>
      </div>`;
  });
}

function toggleFavorite(id) {
  FavoritesStore.toggle(id);
  renderTenantHouses();
}

/* ---------------- FAVORITES PAGE ---------------- */
function renderFavorites() {
  const el = document.getElementById('favoritesList');
  if (!el) return;

  const favs = FavoritesStore.getAll();
  const houses = HousesStore.getAll().filter(h => favs.includes(h.id));

  el.innerHTML = '';
  if (!houses.length) {
    el.innerHTML = '<p>No favorites yet</p>';
    return;
  }

  houses.forEach(h => {
    el.innerHTML += `
      <div class="property-card">
        <h3>${h.title}</h3>
        <p>${h.location}</p>
        <p>₹${h.rent}</p>
      </div>`;
  });
}
