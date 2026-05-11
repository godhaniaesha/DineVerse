import React from 'react';

const IcChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const IcChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage = 10,
  totalItems,
  className = ""
}) {
  // Don't show pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={`admin_pagination ${className}`}>
      <button 
        className="admin_pagination__btn"
        onClick={handlePrev}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <IcChevronLeft />
      </button>
      
      <div className="admin_pagination__info">
        <span className="admin_pagination__current">{currentPage}</span>
        <span className="admin_pagination__separator">/</span>
        <span className="admin_pagination__total">{totalPages}</span>
      </div>
      
      <button 
        className="admin_pagination__btn"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <IcChevronRight />
      </button>
      
      {totalItems && (
        <div className="admin_pagination__items">
          <span className="admin_pagination__items-text">
            {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
          </span>
        </div>
      )}
    </div>
  );
}
