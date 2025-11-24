document.addEventListener("DOMContentLoaded", () => {
  const mapElement = document.getElementById("map");
  if (!mapElement) return;

  const locations = JSON.parse(mapElement.dataset.locations);

  const map = L.map("map", { scrollWheelZoom: false });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 18,
  }).addTo(map);

  const markers = [];

  locations.forEach((loc) => {
    const [lng, lat] = loc.coordinates;

    // Add marker
    const marker = L.marker([lat, lng]).addTo(map);
    markers.push(marker);

    // Create standalone popup that stays open
    const popup = L.popup({
      closeButton: false,
      autoClose: false,
      closeOnClick: false,
      offset: [0, -30],
      className: "custom-popup", // optional custom class for styling
    })
      .setLatLng([lat, lng])
      .setContent(`<p><strong>Day ${loc.day}:</strong> ${loc.description}</p>`)
      .openOn(map); // This shows popup immediately
  });

  // Fit map to all markers
  const bounds = L.featureGroup(markers).getBounds();
  map.fitBounds(bounds, { padding: [100, 100] });

  // If only one marker, zoom out a bit
  if (markers.length === 1) {
    map.setView(markers[0].getLatLng(), 10);
  }

  // Fix rendering if map container was hidden
  setTimeout(() => map.invalidateSize(), 300);
});
