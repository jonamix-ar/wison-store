"use client";

import { useEffect, useMemo, useState } from "react";
import EmptyBig from "@/components/common/EmptyBig";
import { Plus, User } from "lucide-react";
import Loading from "@/components/Ui/Loading";
import { getAllCustomers } from "@/services/customers-service";
import { Users } from "@/types/users";
import CustomerList from "../CustomerList/CustomerList";
import { useRouter } from "next/navigation";

interface UserContainerProps {
    pageSize: number;
    columns: { id: string; header: string }[];
    searchTerm: string;
}

const CustomerContainer: React.FC<UserContainerProps> = ({
    pageSize,
    columns,
    searchTerm,
}) => {
    const [customers, setCustomers] = useState<Users[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const loadCustomers = async () => {
            try {
                setIsLoading(true);
                const response = await getAllCustomers();
                setCustomers(response);
            } catch (error) {
                console.error("Error fetching customers:", error);
                setError("Failed to fetch customers. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        loadCustomers();
    }, []);

    const filteredcustomers = useMemo(() => {
        return customers.filter((user) =>
            Object.values(user).some((value) =>
                value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [customers, searchTerm]);

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleCreateCustomer = () => {
       return router.push("/admin/customers/create");
    };

    return (
        <>
            {customers.length > 0 ? (
                <CustomerList customers={filteredcustomers} pageSize={pageSize} columns={columns} />
            ) : (
                <EmptyBig
                    emptyStateMessage="Aún no tienes usuarios"
                    emptyStateDescription="Crea tu primer usuario y empieza a vender."
                    icon={<User className="mx-auto h-16 w-16 text-gray-400" />}
                    button={
                        <button
                            onClick={handleCreateCustomer}
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white bg-emerald-500 hover:bg-emerald-600"
                        >
                            <Plus className="h-4 w-4" />
                            Crear cliente o mayorista
                        </button>
                    }
                />
            )}
        </>
    );
};

export default CustomerContainer;