import { useState } from "react";
import { actions } from "astro:actions";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";

import type { City } from "../models/City";
import { findBestMeetingCity } from "../utils/cities";

interface CityFinderProps {
  apiKey: string;
}

export const CityFinder = ({ apiKey }: CityFinderProps) => {
  const [cities, setCities] = useState<City[]>([]);
  const [cityInput, setCityInput] = useState<string>("");
  const [bestCity, setBestCity] = useState<City | null>(null);
  const [error, setError] = useState<string>("");

  const handleAddCity = async () => {
    if (cityInput) {
      try {
        const { data } = await actions.getCoordinates({
          name: cityInput,
        });
        if (data) {
          setCities([...cities, data]);
        } else {
          setError("City data is not valid.");
        }
        setCityInput("");
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
      }
    }
  };

  const handleResetCities = () => {
    setCities([]);
  };

  const handleSubmit = async () => {
    console.log(cities);
    try {
      const bestCity = await findBestMeetingCity(cities, apiKey);
      setBestCity(bestCity);
    } catch (err) {
      setError("Failed to find the best city. Please try again.");
    }
  };

  return (
    <div>
      <h1>City Finder</h1>
      <Input
        value={cityInput}
        onInput={(e) => setCityInput((e.target as HTMLInputElement).value)}
        placeholder="Enter a city"
      />
      <Button onClick={handleAddCity}>Add City</Button>
      <Button onClick={handleResetCities}>Reset</Button>

      <div style={{ marginTop: "10px" }}>
        {cities.map((city, index) => (
          <Badge key={index} style={{ marginRight: "5px" }}>
            {city.name}
          </Badge>
        ))}
      </div>

      <Button onClick={handleSubmit} style={{ marginTop: "10px" }}>
        Find Best City
      </Button>

      {bestCity && <Alert>Your best meeting city is: {bestCity.name}</Alert>}
      {error && <Alert>{error}</Alert>}
    </div>
  );
};
