import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import classNames from "classnames";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-between w-full px-4 py-3 text-[0.9em] font-medium">
      <div className="row gap-[1em]">
        {/* Left Chevron for Previous Page */}
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          className={classNames(
            "p-2 rounded-lg border-2 border-[#D0D5DD] transition-all",
            {
              "cursor-not-allowed": currentPage === 1 || totalPages === 0,
              "hover:bg-gray-100": currentPage > 1,
            }
          )}
          style={{ boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)" }}
        >
          <FiChevronLeft
            size={20}
            className={classNames({
              "text-inputs": currentPage === 1 || totalPages === 0,
              "text-txt": currentPage > 1,
            })}
          />
        </button>

        {/* Right Chevron for Next Page */}
        <button
          onClick={() =>
            currentPage < totalPages && onPageChange(currentPage + 1)
          }
          className={classNames(
            "p-2 rounded-lg border-2 border-[#D0D5DD] transition-all",
            {
              "cursor-not-allowed":
                currentPage === totalPages || totalPages === 0,
              "hover:bg-gray-100": currentPage < totalPages,
            }
          )}
          style={{ boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)" }}
        >
          <FiChevronRight
            size={20}
            className={classNames({
              "text-inputs": currentPage === totalPages || totalPages === 0,
              "text-txt": currentPage < totalPages,
            })}
          />
        </button>
      </div>

      {/* Page Indicator */}
      {totalPages === 0 ? (
        <p className="text-center text-[#344054] font-semibold">Aucune page</p>
      ) : (
        <p className="ml-auto text-[#344054] font-semibold">
          {currentPage} of {totalPages}
        </p>
      )}
    </div>
  );
};

export default Pagination;
