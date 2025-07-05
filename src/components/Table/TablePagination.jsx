const TablePagination = ({ currentPage, totalPages, onPageChange }) => {
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
  
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
  
    return (
      <div className="pagination" style={{ display: 'flex', justifyContent: 'center', padding: '16px 0', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous Page"
          style={{
            padding: '8px 12px',
            border: 'none',
            borderRadius: '50%',
            background: currentPage === 1 ? '#f0f0f0' : '#fff',
            color: '#007bff',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
            minWidth: '36px',
            minHeight: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ←
        </button>
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page ? 'page' : undefined}
            style={{
              padding: '8px 12px',
              border: 'none',
              borderRadius: '50%',
              background: currentPage === page ? '#007bff' : '#fff',
              color: currentPage === page ? '#fff' : '#007bff',
              fontWeight: currentPage === page ? 'bold' : 'normal',
              cursor: 'pointer',
              boxShadow: currentPage === page ? '0 2px 8px rgba(0,123,255,0.15)' : '0 1px 4px rgba(0,0,0,0.07)',
              minWidth: '36px',
              minHeight: '36px',
              margin: '0 2px',
              outline: currentPage === page ? '2px solid #007bff' : 'none',
            }}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next Page"
          style={{
            padding: '8px 12px',
            border: 'none',
            borderRadius: '50%',
            background: currentPage === totalPages ? '#f0f0f0' : '#fff',
            color: '#007bff',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
            minWidth: '36px',
            minHeight: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          →
        </button>
      </div>
    );
  };

  export default TablePagination