"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createCustomer } from "@/services/customers-service";
import { getCountries, getStates } from "@/services/settings-service";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const customerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["CUSTOMER", "WHOLESALER"] as const),
    phone: z.string().optional(),
    address: z.string().optional(),
    country: z.string().min(1, "Please select a country"),
    states: z.string().min(1, "Please select a state"),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    document: z.enum(["dni", "cuit-cuil", "lc", "le"]).optional(),
    documentNumber: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface Country {
    id: number;
    name: string;
}

interface State {
    id: number;
    name: string;
}

export default function UserCreationForm() {
    const router = useRouter();
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CustomerFormData>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
            name: "",
            email: "",
            role: "CUSTOMER",
            phone: "",
            address: "",
            country: "9",
            states: "129",
            city: "",
            postalCode: "",
            document: "dni",
            documentNumber: "",
        },
    });

    const selectedCountry = watch("country");

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const countriesData = await getCountries();
                setCountries(countriesData);
            } catch (error) {
                console.error("Error fetching countries:", error);
                toast.error("Error al cargar los países");
            }
        };

        fetchCountries();
    }, []);

    useEffect(() => {
        const fetchStates = async () => {
            if (selectedCountry) {
                try {
                    const statesData = await getStates(parseInt(selectedCountry));
                    setStates(statesData);
                } catch (error) {
                    console.error("Error fetching states:", error);
                    toast.error("Error al cargar los estados");
                }
            } else {
                setStates([]);
            }
        };

        fetchStates();
    }, [selectedCountry]);

    const onSubmit = async (data: CustomerFormData) => {
        try {
            await createCustomer(data);
            toast.success("Cliente creado exitosamente");
            router.push("/admin/customers");
        } catch (error) {
            console.error("Error creating customer:", error);
            toast.error("Error al crear usuario");
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-8">
            <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Crear Nuevo Cliente o Mayorista
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Información Básica */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                            Información Básica
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre
                                </label>
                                <input
                                    id="name"
                                    {...register("name")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Correo Electrónico
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                    Rol
                                </label>
                                <select
                                    id="role"
                                    {...register("role")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="CUSTOMER">Cliente</option>
                                    <option value="WHOLESALER">Mayorista</option>
                                </select>
                                {errors.role && (
                                    <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Teléfono
                                </label>
                                <input
                                    id="phone"
                                    {...register("phone")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Dirección */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                            Dirección
                        </h3>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                Dirección
                            </label>
                            <input
                                id="address"
                                {...register("address")}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.address && (
                                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                                    País
                                </label>
                                <Controller
                                    name="country"
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Seleccione un país</option>
                                            {countries.map((country) => (
                                                <option key={country.id} value={country.id.toString()}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                                {errors.country && (
                                    <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="states" className="block text-sm font-medium text-gray-700 mb-1">
                                    Estado/Provincia
                                </label>
                                <Controller
                                    name="states"
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            disabled={!selectedCountry}
                                        >
                                            <option value="">Seleccione un estado</option>
                                            {states.map((state) => (
                                                <option key={state.id} value={state.id.toString()}>
                                                    {state.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                                {errors.states && (
                                    <p className="mt-1 text-sm text-red-600">{errors.states.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ciudad
                                </label>
                                <input
                                    id="city"
                                    {...register("city")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.city && (
                                    <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                                    Código Postal
                                </label>
                                <input
                                    id="postalCode"
                                    {...register("postalCode")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.postalCode && (
                                    <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Documentación */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                            Documentación
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo de Documento
                                </label>
                                <select
                                    id="document"
                                    {...register("document")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="dni">DNI</option>
                                    <option value="cuit-cuil">CUIT/CUIL</option>
                                    <option value="lc">LC</option>
                                    <option value="le">LE</option>
                                </select>
                                {errors.document && (
                                    <p className="mt-1 text-sm text-red-600">{errors.document.message}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                    Número de Documento
                                </label>
                                <input
                                    id="documentNumber"
                                    {...register("documentNumber")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.documentNumber && (
                                    <p className="mt-1 text-sm text-red-600">{errors.documentNumber.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Creando..." : "Crear Cliente"}
                    </button>
                </form>
            </div>
        </div>
    );
}
