import { useState } from "react";
import { actions } from "astro:actions";

import type { City } from "../models/City";
import { findBestMeetingCity } from "../utils/cities";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { CityForm } from "@/components/forms/CityForm.tsx";

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
    try {
      const bestCity = await findBestMeetingCity(cities, apiKey);
      setBestCity(bestCity);
    } catch (err) {
      console.log(err);
      setError("Failed to find the best city. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold text-center mb-4">City Finder</h1>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        <CityForm handleAddCity={handleAddCity} />

        {/* <Input
          className="flex-grow mr-2"
          value={cityInput}
          onInput={(e) => setCityInput((e.target as HTMLInputElement).value)}
          placeholder="Enter a city name"
          autoFocus={true}
        />
        <Button
          className="flex-shrink-0"
          onSubmit={handleAddCity}
          type="submit"
        >
          Add City
        </Button>*/}
      </div>

      <div className="flex flex-wrap mb-4">
        {cities.map((city, index) => (
          <Badge key={index} className="mr-2 mb-2">
            {city.name}
          </Badge>
        ))}
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700"
      >
        Find Best City
      </Button>
      <Button
        onClick={handleResetCities}
        className="w-full mt-4 bg-orange-600 text-white hover:bg-orange-700"
      >
        Reset
      </Button>

      {bestCity && (
        <Alert className="mt-4">
          Your best meeting city is: {bestCity.name}
        </Alert>
      )}
      {error && <Alert className="mt-4 text-red-500">{error}</Alert>}
    </div>
  );
};
