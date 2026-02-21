import { useSort } from "@/context/SortContext";
import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  setQueryPagination?: React.Dispatch<
    React.SetStateAction<{
      pageIndex: number;
      pageSize: number;
      totalItems: number;
    }>
  >;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, itemsPerPage, setQueryPagination }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const { setPagination } = useSort();

  const setToUse = setQueryPagination || setPagination;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setToUse((prev) => ({ ...prev, pageIndex: page }));
    }
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(event.target.value);
    setToUse({ pageSize: newItemsPerPage, pageIndex: 1, totalItems: totalItems });
  };

  const itemsPerPageOptions = totalItems < 10 ? [totalItems] : [10, 24, 50, 80, 100, 250, 500];

  return (
    <div className="relative w-full">
      <div className="glass-card">
        <div className="glass-bg" />
        <div className="glass-blur" />
        <div className="glass-border" />

        <div className="relative z-10 p-4">
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 w-full">
            {/* Itens por página */}
            <div className="flex items-center gap-3">
              <span className="body-callout text-text-muted">Itens por página</span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className={cn(
                  "px-3 py-2 rounded-lg",
                  "bg-black/40 border border-white/10",
                  "text-foreground body-callout-bold",
                  "focus:outline-none focus:ring-2 focus:ring-kgb-gold/50",
                  "transition-all cursor-pointer"
                )}
              >
                {itemsPerPageOptions.map((value) => (
                  <option key={value} value={value} className="bg-kgb-black text-foreground">
                    {value}
                  </option>
                ))}
              </select>
              {totalItems > 0 && (
                <span className="body-callout text-text-subtle">
                  Total: <span className="text-kgb-gold font-bold">{totalItems}</span>
                </span>
              )}
            </div>

            {/* Controles de página */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="body-callout text-text-muted">
                Página <span className="text-kgb-gold font-bold">{currentPage}</span> de{" "}
                <span className="text-foreground font-bold">{totalPages}</span>
              </span>
              <div className="flex gap-2">
                <button
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    "bg-black/40 border border-white/10",
                    "text-foreground hover:text-kgb-gold",
                    "hover:border-kgb-gold/30 hover:bg-kgb-gold/10",
                    "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-foreground disabled:hover:border-white/10"
                  )}
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  aria-label="Ir para a primeira página"
                >
                  <FaAnglesLeft className="w-4 h-4" />
                </button>
                <button
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    "bg-black/40 border border-white/10",
                    "text-foreground hover:text-kgb-gold",
                    "hover:border-kgb-gold/30 hover:bg-kgb-gold/10",
                    "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-foreground disabled:hover:border-white/10"
                  )}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Ir para a página anterior"
                >
                  <FaAngleLeft className="w-4 h-4" />
                </button>
                <button
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    "bg-black/40 border border-white/10",
                    "text-foreground hover:text-kgb-gold",
                    "hover:border-kgb-gold/30 hover:bg-kgb-gold/10",
                    "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-foreground disabled:hover:border-white/10"
                  )}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Ir para a próxima página"
                >
                  <FaAngleRight className="w-4 h-4" />
                </button>
                <button
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    "bg-black/40 border border-white/10",
                    "text-foreground hover:text-kgb-gold",
                    "hover:border-kgb-gold/30 hover:bg-kgb-gold/10",
                    "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-foreground disabled:hover:border-white/10"
                  )}
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  aria-label="Ir para a última página"
                >
                  <FaAnglesRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
