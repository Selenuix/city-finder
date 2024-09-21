import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { getCoordinates } from "@/utils/getCoordinates";
import { getNearbyCities } from "@/utils/getNearbyCities.ts";
import { getTravelTime } from "@/utils/getTravelTime.ts";
import type { City } from "@/models/City.ts";

export const server = {
  getCoordinates: defineAction({
    input: z.object({
      name: z.string(),
    }),
    handler: async ({ name }) => {
      try {
        return await getCoordinates({ name });
      } catch (error) {
        if (error instanceof Error) {
          console.error(error);
          throw new Error(`Error fetching coordinates: ${error.message}`);
        }
      }
    },
  }),
  getNearbyCities: defineAction({
    input: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }),
    handler: async ({ latitude, longitude }) => {
      try {
        return await getNearbyCities({ latitude, longitude });
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error in action 'getNearbyCities':", error);
          throw new Error(`Error fetching nearby cities: ${error.message}`);
        }
      }
    },
  }),
  getTravelTime: defineAction({
    input: z.object({
      origin: z.object({
        name: z.string(),
        latitude: z.number(),
        longitude: z.number(),
      }),
      destination: z.object({
        name: z.string(),
        latitude: z.number(),
        longitude: z.number(),
      }),
    }),
    handler: async ({ origin, destination }) => {
      try {
        return await getTravelTime(origin, destination);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error in action 'getTravelTime':", error);
          throw new Error(`Error fetching nearby cities: ${error.message}`);
        }
      }
    },
  }),
};
