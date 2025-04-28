import { Button } from './ui/button';

function Pagination({ currentPage, totalPages, setCurrentPage }) {
  return (
    <div className="flex justify-center gap-4 mt-6">
      <Button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
        className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-500"
      >
        Previous
      </Button>
      <span className="self-center text-gray-200">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
        className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-500"
      >
        Next
      </Button>
    </div>
  );
}

export default Pagination;