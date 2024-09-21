import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { getCoordinates } from "@/utils/getCoordinates";
import { getNearbyCities } from "@/utils/getNearbyCities.ts";

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
          console.error("Error in action:", error);
          throw new Error(`Error fetching nearby cities: ${error.message}`);
        }
      }
    },
  }),
};
