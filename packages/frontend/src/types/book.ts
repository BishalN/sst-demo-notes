import { z } from "zod";

export const BookSchema = z.object({
  // fields are used for dynamoDB
  userId: z.string(), // partition key
  bookId: z.string(), // sort key

  // general fields
  title: z.string(),
  author: z.string(),
  genre: z.string(),
  readingStatus: z.enum(["Not Started", "In Progress", "Completed"]),
  notes: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// export type

export type BookType = z.infer<typeof BookSchema>;
