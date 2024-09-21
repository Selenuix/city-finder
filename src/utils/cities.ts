// Helper function to get nearby cities based on geographical midpoint using Google Places API
import type { City } from "../models/City.ts";
import axios from "axios";

async function getNearbyCities(
  latitude: number,
  longitude: number,
  apiKey: string,
): Promise<City[]> {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=50000&type=locality&key=${apiKey}`;
  try {
    const response = await axios.get(url);
    return response.data.results.map((place: any) => ({
      name: place.name,
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
    }));
  } catch (error) {
    console.error("Error fetching nearby cities:", error);
    return [];
  }
}

// Function to calculate the geographical midpoint of a list of cities
function calculateGeographicalMidpoint(cities: City[]): {
  latitude: number;
  longitude: number;
} {
  let x = 0,
    y = 0,
    z = 0;

  for (const city of cities) {
    const lat = (city.latitude! * Math.PI) / 180; // Convert to radians
    const lon = (city.longitude! * Math.PI) / 180; // Convert to radians

    x += Math.cos(lat) * Math.cos(lon);
    y += Math.cos(lat) * Math.sin(lon);
    z += Math.sin(lat);
  }

  const total = cities.length;

  x = x / total;
  y = y / total;
  z = z / total;

  const centralLongitude = Math.atan2(y, x);
  const centralSquareRoot = Math.sqrt(x * x + y * y);
  const centralLatitude = Math.atan2(z, centralSquareRoot);

  return {
    latitude: (centralLatitude * 180) / Math.PI, // Convert back to degrees
    longitude: (centralLongitude * 180) / Math.PI, // Convert back to degrees
  };
}

// Function to get travel time between two cities using Google Distance Matrix API
async function getTravelTime(
  origin: City,
  destination: City,
  apiKey: string,
): Promise<number> {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin.name}&destinations=${destination.name}&key=${apiKey}`;
  try {
    const response = await axios.get(url);
    const travelTime = response.data.rows[0].elements[0].duration.value; // Duration in seconds
    return travelTime / 3600; // Convert to hours
  } catch (error) {
    console.error(
      `Error fetching travel time from ${origin.name} to ${destination.name}:`,
      error,
    );
    return Infinity; // In case of an error, return an infinitely large travel time
  }
}

// Find the best meeting city from a dynamically generated list of cities near the geographical midpoint
export async function findBestMeetingCity(
  cities: City[],
  apiKey: string,
): Promise<City | null> {
  if (cities.length < 2) return null;

  // Step 1: Calculate the geographical midpoint
  const midpoint = calculateGeographicalMidpoint(cities);

  // Step 2: Get nearby cities around the midpoint
  const nearbyCities = await getNearbyCities(
    midpoint.latitude,
    midpoint.longitude,
    apiKey,
  );

  if (nearbyCities.length === 0) {
    console.log("No nearby cities found.");
    return null;
  }

  let bestCity: City | null = null;
  let shortestTotalTravelTime = Infinity;

  // Step 3: Calculate travel times to each nearby city
  for (const destination of nearbyCities) {
    let totalTravelTime = 0;

    // Sum the travel time from each origin city to the destination city
    for (const origin of cities) {
      const travelTime = await getTravelTime(origin, destination, apiKey);
      totalTravelTime += travelTime;
    }

    // Find the city with the shortest total travel time
    if (totalTravelTime < shortestTotalTravelTime) {
      shortestTotalTravelTime = totalTravelTime;
      bestCity = destination;
    }
  }

  return bestCity;
}
