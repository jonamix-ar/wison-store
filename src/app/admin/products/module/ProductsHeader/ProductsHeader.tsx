"use client";
import { useEffect, useState } from "react";
import { ViewMode } from "@/types/products";
import {
  FileDown,
  FileUp,
  Grid,
  List,
  Plus,
  QrCode,
  Search,
  Zap,
} from "lucide-react";
import RowsSize from "@/components/Table/Module/RowsSize/RowsSize";
import ColumnVisibilityDropdown from "@/components/Ui/Dropdowns/ColumnVisibilityDropdown";
import Link from "next/link";

interface ProductsHeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: "list" | "grid") => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  columns: { id: string; header: string }[];
  visibleColumns: string[];
  setVisibleColumns: (columns: string[]) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const ProductsHeader: React.FC<ProductsHeaderProps> = ({
  viewMode,
  setViewMode,
  pageSize,
  setPageSize,
  columns,
  visibleColumns,
  setVisibleColumns,
  searchTerm,
  setSearchTerm,
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    // Load the saved view mode from localStorage when the component mounts
    const savedViewMode = localStorage.getItem("viewMode") as ViewMode;
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, [setViewMode]);

  const toggleViewMode = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      const newViewMode = viewMode === "list" ? "grid" : "list";
      setViewMode(newViewMode);
      // Save the new view mode to localStorage
      localStorage.setItem("viewMode", newViewMode);
    }, 50); // Half of the transition duration
  };

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 50); // Full transition duration
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  return (
    <div className="flex items-center gap-2 rounded-lg border bg-white p-2">
      <div className="flex flex-1 items-center gap-2">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar..."
          className="flex-1 border-0 bg-transparent focus:outline-none"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <Link
        href="/admin/products/create"
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-600 border border-gray-300 hover:bg-gray-100"
      >
        <Plus className="h-5 w-5" />
        Nuevo producto
      </Link>
      <button className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-600 border border-gray-300 hover:bg-gray-100">
        <FileDown className="h-5 w-5" />
        Exportar
      </button>
      <button className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-600 border border-gray-300 hover:bg-gray-100">
        <FileUp className="h-5 w-5" />
        Importar
      </button>
      <RowsSize pageSize={pageSize} setPageSize={setPageSize} />
      <ColumnVisibilityDropdown
        columns={columns}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
      />
      <div className="flex items-center gap-2">
        <button className="rounded-md p-2 hover:bg-gray-100">
          <QrCode className="h-5 w-5" />
        </button>
        <button className="rounded-md p-2 hover:bg-gray-100">
          <Zap className="h-5 w-5" />
        </button>
        <button
          className="rounded-md p-2 hover:bg-gray-100 relative w-8 h-8 overflow-hidden"
          onClick={toggleViewMode}
        >
          <div
            className={`absolute inset-0 flex items-center justify-center transition-transform duration-50 ${
              isTransitioning ? "scale-0" : "scale-100"
            }`}
          >
            {viewMode === "list" ? (
              <List className="h-5 w-5" />
            ) : (
              <Grid className="h-5 w-5" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default ProductsHeader;
