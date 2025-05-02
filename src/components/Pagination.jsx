import { Button } from './ui/button';
import { useMemo } from 'react';

function Pagination({ currentBatch, totalBatches, onBatchChange, totalPokemon }) {
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(1, currentBatch - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalBatches, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentBatch, totalBatches]);

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <div className="flex justify-center items-center gap-2">
        <Button
          disabled={currentBatch === 1}
          onClick={() => onBatchChange(1)}
          className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-500"
        >
          First
        </Button>
        <Button
          disabled={currentBatch === 1}
          onClick={() => onBatchChange(currentBatch - 1)}
          className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-500"
        >
          Previous
        </Button>

        {pageNumbers.map((page) => (
          <Button
            key={page}
            onClick={() => onBatchChange(page)}
            className={`${
              page === currentBatch
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            } border-gray-700`}
          >
            {page}
          </Button>
        ))}

        <Button
          disabled={currentBatch === totalBatches}
          onClick={() => onBatchChange(currentBatch + 1)}
          className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-500"
        >
          Next
        </Button>
        <Button
          disabled={currentBatch === totalBatches}
          onClick={() => onBatchChange(totalBatches)}
          className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-500"
        >
          Last
        </Button>
      </div>

    </div>
  );
}

export default Pagination;