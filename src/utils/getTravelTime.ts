// Function to get travel time between two cities using Google Distance Matrix API
import type { City } from "@/models/City.ts";
import axios from "axios";

export async function getTravelTime(
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
    return Infinity; // In case of an error, return infinitely large travel time
  }
}
