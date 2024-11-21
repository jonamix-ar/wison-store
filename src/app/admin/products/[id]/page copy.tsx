"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Sparkles, DollarSign, PlusCircle } from "lucide-react";
import ImageUpload from "@/app/admin/products/module/ImageUpload/ImageUpload";
import { Editor } from "@tinymce/tinymce-react";

import {
  getBrands,
  getCategories,
  getProduct,
  editProduct,
} from "@/services/products-service";
import { Brand, Category, Product, ProductImage } from "@/types/products";
import { API_ENDPOINTS } from "@/constants/api-endpoint";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/components/Ui/Loading";
import { toast } from "react-toastify";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string(),
  description: z.string(),
  categoryId: z.string(),
  brandId: z.string().min(1, "Brand is required"),
  sku: z.string(),
  qty: z.number().int().min(0),
  qtyBellowMin: z.number().int().min(0),
  price: z.number().min(0),
  promotionalPrice: z.number().min(0),
  priceWholeSaller: z.number().min(0),
  cost: z.number().min(0),
  showPrice: z.boolean(),
  showPriceWholeWaller: z.boolean(),
  status: z.boolean(),
  attributes: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
      qty: z.number().int().min(0),
      price: z.number().min(0),
      priceWholesaler: z.number().min(0),
    })
  ),
  images: z.array(z.instanceof(File)).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProductEdit() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [profitMargin, setProfitMargin] = useState("0.00");
  const [product, setProduct] = useState<Product | null>(null);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const id = params?.id;

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      categoryId: "",
      brandId: "",
      sku: "",
      qty: 0,
      qtyBellowMin: 0,
      price: 0,
      promotionalPrice: 0,
      priceWholeSaller: 0,
      cost: 0,
      showPrice: true,
      showPriceWholeWaller: false,
      status: true,
      attributes: [],
      images: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });

  const watchPrice = watch("price");
  const watchCost = watch("cost");
  const watchShowPrice = watch("showPrice");
  const watchShowWholesalePrice = watch("showPriceWholeWaller");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedCategories, fetchedBrands] = await Promise.all([
          getCategories(),
          getBrands(),
        ]);
        setCategories(fetchedCategories);
        setBrands(fetchedBrands);

        if (id) {
          const response = await getProduct(Number(id));
          const productData = response.data;
          setProduct(productData);
          setProductImages(productData.productImage || []);
          // Populate form with product data
          Object.keys(productData).forEach((key) => {
            if (key === "categoryId" || key === "brandId") {
              setValue(key as keyof FormValues, String(productData[key]));
            } else if (key === "attributes") {
              // Set attributes with their IDs
              setValue("attributes", productData[key]);
            } else if (key !== "productImage") {
              setValue(key as keyof FormValues, productData[key]);
            }
          });
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, setValue]);

  useEffect(() => {
    if (watchPrice && watchCost) {
      const margin = (
        ((Number(watchPrice) - Number(watchCost)) / Number(watchPrice)) *
        100
      ).toFixed(2);
      setProfitMargin(isNaN(parseFloat(margin)) ? "0.00" : margin);
    }
  }, [watchPrice, watchCost]);

  const onSubmit = async (data: FormValues) => {
    setError(null);
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === "attributes") {
          formData.append(key, JSON.stringify(value));
        } else if (key === "images") {
          // Skip images here, we'll handle them separately
        } else {
          formData.append(key, String(value));
        }
      });

      // Handle image uploads
      if (data.images && data.images.length > 0) {
        data.images.forEach((file, index) => {
          formData.append(`images`, file);
        });
      }

      const responseData = await editProduct(formData, Number(id));
      toast.success("¡Producto actualizado exitosamente!");
      router.push("/admin/products");
    } catch (error) {
      if (error instanceof Error) {
        setError(`Failed to update product: ${error.message}`);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSwitch = (
    field: keyof Pick<FormValues, "showPrice" | "showPriceWholeWaller">
  ) => {
    setValue(field, !watch(field));
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-row gap-4 justify-center">
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 w-screen md:w-1/2"
      >
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Nombre y descripción
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre
              </label>
              <input
                type="text"
                id="name"
                {...register("name")}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Leather jacket"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Descripción
                </label>
                <button
                  type="button"
                  className="inline-flex items-center text-sm text-blue-600"
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  Generar con IA (Proximamente)
                </button>
              </div>
              <Controller
                name="description"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Editor
                    apiKey={`${process.env.NEXT_PUBLIC_TINYMCE_API_KEY}`}
                    value={value}
                    onEditorChange={onChange}
                    init={{
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "code",
                        "help",
                        "wordcount",
                      ],
                      toolbar:
                        "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                      content_css: "editor",
                    }}
                  />
                )}
              />
            </div>
          </div>
        </div>

        <ImageUpload
          productId={Number(id)}
          initialImages={productImages}
          onImagesChange={(newImages) => setValue("images", newImages)}
        />

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Categorías y Marcas
          </h2>
          <p>Ayudá a tus clientes a encontrar más rápido tus productos.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            <div>
              <label
                htmlFor="categoryId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Categorías
              </label>
              <select
                id="categoryId"
                {...register("categoryId")}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="brandId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Marcas
              </label>
              <select
                id="brandId"
                {...register("brandId")}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="">Seleccione una marca</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Precios</h2>

          <div className="grid gap-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="price"
                  className="text-sm font-medium text-gray-700"
                >
                  Precio de venta
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="price"
                    {...register("price", { valueAsNumber: true })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-8 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="promotionalPrice"
                  className="text-sm font-medium text-gray-700"
                >
                  Precio promocional
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="promotionalPrice"
                    {...register("promotionalPrice", { valueAsNumber: true })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-8 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="wholesalePrice"
                className="text-sm font-medium text-gray-700"
              >
                Precio al por mayor
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="priceWholeSaller"
                  {...register("priceWholeSaller", { valueAsNumber: true })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-8 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="cost"
                    className="text-sm font-medium text-gray-700"
                  >
                    Costo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="cost"
                      {...register("cost", { valueAsNumber: true })}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-8 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Para uso interno, sus clientes no verán esto en la tienda.
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="profitMargin"
                    className="text-sm font-medium text-gray-700"
                  >
                    Margen de beneficio
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="profitMargin"
                      value={`${profitMargin}%`}
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-8 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rest of the form components (categories, brands, attributes, etc.) */}

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Configuración
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex-grow flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  Mostrar precio
                </span>
                <span className="text-sm text-gray-500">
                  Mostrar el precio del producto en la tienda.
                </span>
              </span>
              <button
                type="button"
                onClick={() => toggleSwitch("showPrice")}
                className={`${
                  watchShowPrice ? "bg-indigo-600" : "bg-gray-200"
                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                role="switch"
                aria-checked={watchShowPrice}
              >
                <span
                  aria-hidden="true"
                  className={`${
                    watchShowPrice ? "translate-x-5" : "translate-x-0"
                  } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                ></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex-grow flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  Mostrar precio mayorista
                </span>
                <span className="text-sm text-gray-500">
                  Mostrar el precio mayorista del producto en la tienda.
                </span>
              </span>
              <button
                type="button"
                onClick={() => toggleSwitch("showPriceWholeWaller")}
                className={`${
                  watchShowWholesalePrice ? "bg-indigo-600" : "bg-gray-200"
                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                role="switch"
                aria-checked={watchShowWholesalePrice}
              >
                <span
                  aria-hidden="true"
                  className={`${
                    watchShowWholesalePrice ? "translate-x-5" : "translate-x-0"
                  } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                ></span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Variantes
          </h2>
          <p>
            Combiná diferentes propiedades de tu producto. Ejemplo: color +
            tamaño.
          </p>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="space-y-4 p-4 bg-gray-50 rounded-md mb-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor={`attributes.${index}.name`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    {...register(`attributes.${index}.name`)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-8 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`attributes.${index}.value`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Valor
                  </label>
                  <input
                    type="text"
                    {...register(`attributes.${index}.value`)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-8 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor={`attributes.${index}.qty`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Cantidad
                  </label>
                  <input
                    type="number"
                    {...register(`attributes.${index}.qty`, {
                      valueAsNumber: true,
                    })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-8 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`attributes.${index}.price`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Precio
                  </label>
                  <input
                    type="number"
                    {...register(`attributes.${index}.price`, {
                      valueAsNumber: true,
                    })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-8 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`attributes.${index}.priceWholesaler`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Precio mayorista
                  </label>
                  <input
                    type="number"
                    {...register(`attributes.${index}.priceWholesaler`, {
                      valueAsNumber: true,
                    })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-8 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Eliminar variante
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              append({
                name: "",
                value: "",
                qty: 0,
                price: 0,
                priceWholesaler: 0,
              })
            }
            className="mt-4 inline-flex items-center border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusCircle className="h-5 w-5 mr-1" />
            Agregar variante
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Guardar producto
          </button>
        </div>
      </form>
    </div>
  );
}
