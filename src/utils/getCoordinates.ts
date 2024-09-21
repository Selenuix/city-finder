import { GOOGLE_MAPS_API_KEY } from "astro:env/server";

export const getCoordinates = async ({ name }: { name: string }) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(name)}&key=${GOOGLE_MAPS_API_KEY}`,
  );
  const data = await response.json();

  if (data.results && data.results.length > 0) {
    const location = data.results[0].geometry.location;
    return {
      name,
      latitude: location.lat,
      longitude: location.lng,
    };
  }

  throw new Error("Coordinates not found for the city");
};
