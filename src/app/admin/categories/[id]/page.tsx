'use client'

import Loading from "@/components/Ui/Loading";
import { editCategory } from "@/services/products-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import { Sparkles } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const categorySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
    status: z.boolean(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CategoryEdit({ params }: { params: { id: string } }) {
    const editorRef = useRef<any>(null);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [formError, setFormError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
        reset,
        setValue,
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
    });

    const watchStatus = watch("status");

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await fetch(`/api/categories/${params.id}`);
                if (!response.ok) throw new Error("Failed to fetch category");
                const data = await response.json();
                reset({
                    name: data.name,
                    description: data.description || '',
                    status: data.status,
                });
            } catch (error) {
                console.error('Error fetching category:', error);
                toast.error("Error al cargar datos de la categoría");
                setFormError("No se pudo cargar la información de la categoría. Por favor, intente de nuevo.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategory();
    }, [params.id, reset]);

    const onSubmit = async (data: CategoryFormData) => {
        setFormError(null);
        try {
            const response = await editCategory(data, Number(params.id));
            toast.success("Categoría actualizada exitosamente");
            router.push("/admin/categories");
        } catch (error) {
            console.error('Error updating category:', error);
            toast.error("Error al actualizar categoría");
            setFormError("No se pudo actualizar la categoría. Por favor, revise los datos e intente de nuevo.");
        }
    };

    const toggleSwitch = () => {
        setValue("status", !watchStatus);
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="flex flex-row gap-4 justify-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-8 w-full max-w-2xl"
            >
                {formError && (
                    <div
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                        role="alert"
                    >
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{formError}</span>
                    </div>
                )}
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Editar Categoría
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
                                {...register('name')}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Nombre de la categoría"
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
                                    Generar con IA (Próximamente)
                                </button>
                            </div>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Editor
                                        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                                        value={value}
                                        onEditorChange={onChange}
                                        init={{
                                            height: 300,
                                            menubar: false,
                                            plugins: [
                                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                            ],
                                            toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="flex-grow flex flex-col">
                                <span className="text-sm font-medium text-gray-900">
                                    Estado de la categoría
                                </span>
                                <span className="text-sm text-gray-500">
                                    Activar o desactivar la categoría en la tienda.
                                </span>
                            </span>
                            <button
                                type="button"
                                onClick={toggleSwitch}
                                className={`${watchStatus ? "bg-indigo-600" : "bg-gray-200"} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                role="switch"
                                aria-checked={watchStatus}
                            >
                                <span
                                    aria-hidden="true"
                                    className={`${watchStatus ? "translate-x-5" : "translate-x-0"} pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                                ></span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isSubmitting ? "Actualizando..." : "Actualizar Categoría"}
                    </button>
                </div>
            </form>
        </div>
    );
}