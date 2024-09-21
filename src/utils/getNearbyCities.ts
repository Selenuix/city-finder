import { GOOGLE_MAPS_API_KEY } from "astro:env/server";

export async function getNearbyCities({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=50000&type=locality&key=${GOOGLE_MAPS_API_KEY}`,
    );
    const data = await response.json();

    console.log(data.results);

    // Check if the response has valid results
    if (data && data.results && Array.isArray(data.results)) {
      return data.results.map((place: any) => ({
        name: place.name,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
      }));
    } else {
      // Return an empty array if no results are found
      console.log("No nearby cities found in API response.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching nearby cities:", error);
    return [];
  }
}
