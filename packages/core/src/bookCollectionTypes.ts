// use zod to declare types and validate them;
import { z } from "zod";

// Book schema for validation
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
export type IBook = z.infer<typeof BookSchema>;

// create a update book schema from book schema
export const UpdateBookSchema = BookSchema.partial().extend({
  // add required fields
});
export type IUpdateBook = z.infer<typeof UpdateBookSchema>;
