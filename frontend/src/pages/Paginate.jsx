import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

export default function Paginate({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
}) {
    const startItem = Math.min(
        (currentPage - 1) * itemsPerPage + 1,
        totalItems
    );
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        // Always show first page
        pages.push(
            <button
                key={1}
                onClick={() => onPageChange(1)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    currentPage === 1
                        ? "z-10 bg-indigo-600 text-white focus-visible:outline-2 focus-visible:outline-indigo-600"
                        : "text-gray-900 ring-1 ring-gray-300 hover:bg-gray-50"
                }`}
            >
                1
            </button>
        );

        // Show ellipsis if needed after first page
        if (currentPage - 1 > 2) {
            pages.push(
                <span
                    key="ellipsis-start"
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700"
                >
                    ...
                </span>
            );
        }

        // Show surrounding pages
        for (
            let i = Math.max(2, currentPage - 1);
            i <= Math.min(totalPages - 1, currentPage + 1);
            i++
        ) {
            pages.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        currentPage === i
                            ? "z-10 bg-indigo-600 text-white focus-visible:outline-2 focus-visible:outline-indigo-600"
                            : "text-gray-900 ring-1 ring-gray-300 hover:bg-gray-50"
                    }`}
                >
                    {i}
                </button>
            );
        }

        // Show ellipsis if needed before last page
        if (currentPage + 1 < totalPages - 1) {
            pages.push(
                <span
                    key="ellipsis-end"
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700"
                >
                    ...
                </span>
            );
        }

        // Always show last page if there's more than one page
        if (totalPages > 1) {
            pages.push(
                <button
                    key={totalPages}
                    onClick={() => onPageChange(totalPages)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        currentPage === totalPages
                            ? "z-10 bg-indigo-600 text-white focus-visible:outline-2 focus-visible:outline-indigo-600"
                            : "text-gray-900 ring-1 ring-gray-300 hover:bg-gray-50"
                    }`}
                >
                    {totalPages}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{startItem}</span>{" "}
                        to <span className="font-medium">{endItem}</span> of{" "}
                        <span className="font-medium">{totalItems}</span>{" "}
                        results
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-xs">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon className="h-5 w-5" />
                        </button>

                        {renderPageNumbers()}

                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon className="h-5 w-5" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}
