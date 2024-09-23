import { actions } from "astro:actions";
import { useState } from "react";
import { useForm } from "react-hook-form";

import type { City } from "../models/City";
import { findBestMeetingCity } from "../utils/cities";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { CheckCircle, X, XCircle } from "lucide-react";

export const CityFinder = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [cityInput, setCityInput] = useState<string>("");
  const [bestCity, setBestCity] = useState<City | null>(null);
  const [error, setError] = useState<string>("");
  const form = useForm();

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

  const handleRemoveCity = (index: number) => {
    setCities(cities.filter((_, i) => i !== index));
  };

  const handleResetCities = () => {
    setCities([]);
    setBestCity(null);
  };

  const handleSubmit = async () => {
    try {
      const bestCity = await findBestMeetingCity(cities);
      setBestCity(bestCity);
    } catch (err) {
      console.log(err);
      setError("Failed to find the best city. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Find the Best Meeting City</h1>

      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAddCity)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="city"
              render={() => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Paris"
                      value={cityInput}
                      onChange={(e) =>
                        setCityInput((e.target as HTMLInputElement).value)
                      }
                      autoFocus={true}
                    />
                  </FormControl>
                  <FormDescription>Add a city to the list.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Add</Button>
          </form>
        </Form>
      </div>

      <div className={"flex flex-wrap gap-2"}>
        {cities.length > 0 ? (
          cities.map((city, index) => (
            <Badge key={index} className={"flex items-center gap-2 p-2"}>
              {city.name}
              <Button
                onClick={() => handleRemoveCity(index)}
                className={"ml-2"}
              >
                <X className={"w-4 h-4"} />
              </Button>
            </Badge>
          ))
        ) : (
          <p className={"text-gray-600"}>
            No cities added yet. Start by adding a city.
          </p>
        )}
      </div>

      <Button className={"mt-6"} variant="default" onClick={handleSubmit}>
        Find Best City
      </Button>
      <Button
        className={"mt-6"}
        variant="destructive"
        onClick={handleResetCities}
      >
        Reset
      </Button>

      {bestCity && (
        <Alert variant="default" className={"mt-4 flex items-center gap-2"}>
          <CheckCircle className={"w-6 h-6 text-green-500"} />
          <div>
            <AlertTitle className={"font-bold"}>
              Best Meeting City Found!
            </AlertTitle>
            <AlertDescription>
              Your best meeting city is:{" "}
              <span className={"font-bold"}> {bestCity.name}</span>
            </AlertDescription>
          </div>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className={"mt-4 flex items-center gap-2"}>
          <XCircle className={"w-6 h-6 text-red-500"} />
          <div>
            <AlertTitle className={"font-bold"}>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </div>
        </Alert>
      )}
    </div>
  );
};
