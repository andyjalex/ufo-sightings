export function fetchSightings() {
  return fetch(
    "https://my-json-server.typicode.com/Louis-Procode/ufo-Sightings/ufoSightings"
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .catch((error) => {
      throw error;
    });
}
