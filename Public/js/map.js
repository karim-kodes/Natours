document.addEventListener("DOMContentLoaded", () => {
  const mapElement = document.getElementById("map");
  if (!mapElement) return;

  const locations = JSON.parse(mapElement.dataset.locations);
  const map = L.map("map", { scrollWheelZoom: true });

  L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  const points = [];

  locations.forEach((loc) => {
    const [lng, lat] = loc.coordinates;
    points.push([lat, lng]);
    L.marker([lat, lng])
      .addTo(map)
      .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`);
    var popup = L.popup()
      .setLatLng({ lng, lat })
      .setContent(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .openOn(map);
  });

  L.polyline(points, { color: "blue", weight: 2 }).addTo(map);
  const bounds = L.latLngBounds(points);
  map.fitBounds(bounds, { padding: [50, 50] });
});
