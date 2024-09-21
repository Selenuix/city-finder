import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { getCoordinates } from "@/utils/getCoordinates";

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
};
