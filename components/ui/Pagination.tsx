'use client';

import { useId } from 'react';

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export default function Pagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const pageSizeId = useId();
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const firstItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, totalItems);
  const firstPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const pages = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => firstPage + index
  );
  const buttonClass = 'rounded-lg border border-lime/30 px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-lime/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent';

  const pageButton = (page: number) => (
    <button
      key={page}
      type="button"
      onClick={() => onPageChange(page)}
      aria-label={`Go to page ${page}`}
      aria-current={page === currentPage ? 'page' : undefined}
      className={`${buttonClass} ${page === currentPage ? 'bg-lime/20 border-lime text-foreground' : 'bg-surface'}`}
    >
      {page}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-lime/20 p-4">
      <div className="flex flex-wrap items-center gap-4">
        <p aria-live="polite" className="text-sm text-secondary">
          Showing <span className="font-semibold">{firstItem}–{lastItem}</span> of{' '}
          <span className="font-semibold">{totalItems}</span> users
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor={pageSizeId} className="text-sm font-medium text-foreground">
            Rows per page
          </label>
          <select
            id={pageSizeId}
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-lg border border-lime/30 bg-canvas px-2 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-lime"
          >
            {[10, 25, 50].map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </div>
      </div>
      <nav aria-label="User list pagination" className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={buttonClass}
        >
          Previous
        </button>
        {firstPage > 1 && pageButton(1)}
        {firstPage > 2 && <span aria-hidden="true" className="text-subtle">…</span>}
        {pages.map(pageButton)}
        {pages[pages.length - 1] < totalPages - 1 && <span aria-hidden="true" className="text-subtle">…</span>}
        {pages[pages.length - 1] < totalPages && pageButton(totalPages)}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={buttonClass}
        >
          Next
        </button>
      </nav>
    </div>
  );
}
