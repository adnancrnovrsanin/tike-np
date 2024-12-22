"use client";
import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const renderPageNumbers = () => {
    const pages = [];

    // Always show first page
    pages.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        className={`flex h-10 w-10 items-center justify-center rounded border-2 border-[#fd9745] 
          ${
            currentPage === 1
              ? "bg-black text-white"
              : "bg-[#fd9745] text-black"
          }`}
      >
        1
      </button>
    );

    // Add dots if needed
    if (currentPage > 3) {
      pages.push(<MoreHorizontal key="dots-1" className="w-9 text-gray-500" />);
    }

    // Add current page and surrounding pages
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i <= currentPage + 1 && i >= currentPage - 1) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`flex h-10 w-10 items-center justify-center rounded border-2 border-[#fd9745]
              ${
                currentPage === i
                  ? "bg-black text-white"
                  : "bg-[#fd9745] text-black"
              }`}
          >
            {i}
          </button>
        );
      }
    }

    // Add dots if needed
    if (currentPage < totalPages - 2) {
      pages.push(<MoreHorizontal key="dots-2" className="w-9 text-gray-500" />);
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`flex h-10 w-10 items-center justify-center rounded border-2 border-[#fd9745]
            ${
              currentPage === totalPages
                ? "bg-black text-white"
                : "bg-[#fd9745] text-black"
            }`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex h-[51px] w-[469px] items-center justify-center gap-1 p-[2px_0px]">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex h-10 items-center justify-center gap-1 rounded border-2 border-[#fd9745] bg-[#fd9745] px-4 py-2 disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Previous</span>
      </button>

      <div className="flex gap-1">{renderPageNumbers()}</div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex h-10 items-center justify-center gap-1 rounded border-2 border-[#fd9745] bg-[#fd9745] px-4 py-2 disabled:opacity-50"
      >
        <span>Next</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Pagination;
