// productFormSchema.ts
import { z } from "zod";

export const formSchema = z.object({
  categoryId: z.number().int(),
  brandId: z.number().int(),
  slug: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  state: z.enum(["NEW", "USED", "REFURBISHED"]).default("NEW"),
  picture: z.string().nullable(),
  sku: z.string().nullable(),
  qty: z.number().int().default(0),
  qtyBellowMin: z.number().int().nullable().default(0),
  price: z.number().min(0),
  priceWholeSaller: z.number().min(0),
  cost: z.number().min(0),
  promotionalPrice: z.number().min(0),
  showPrice: z.boolean().default(true),
  showPriceWholeWaller: z.boolean().default(false),
  status: z.boolean().default(true),
  attributes: z.array(
    z.object({
      id: z.number().int().optional(),
      name: z.string(),
      value: z.string(),
      qty: z.number().int().default(0),
      price: z.number().min(0),
      priceWholesaler: z.number().min(0),
    })
  ),
  productImage: z.array(
    z.object({
      id: z.number().int().optional(),
      url: z.string(),
      order: z.number().int().default(0),
    })
  ),
});

export type ProductFormValues = z.infer<typeof formSchema>;
