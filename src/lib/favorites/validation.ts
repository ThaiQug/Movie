import { z } from "zod";

export const favoriteInputSchema = z.object({
  movieSlug: z
    .string()
    .trim()
    .min(1, "Thiếu mã phim.")
    .max(160, "Mã phim quá dài.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Mã phim không hợp lệ."),
  movieName: z.string().trim().min(1, "Thiếu tên phim.").max(200),
  moviePosterUrl: z
    .url("URL poster không hợp lệ.")
    .refine((value) => {
      const url = new URL(value);
      return url.protocol === "https:" && url.hostname === "img.ophim.live";
    }, {
      message: "Nguồn poster không được hỗ trợ.",
    })
    .nullable()
    .optional(),
});

export type FavoriteInput = z.infer<typeof favoriteInputSchema>;
