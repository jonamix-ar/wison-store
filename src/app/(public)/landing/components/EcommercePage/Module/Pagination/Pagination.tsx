import { ChevronLeft, ChevronRight } from 'lucide-react'

const Pagination = ({ currentPage, totalPages, onPageChange }: any) => {
    const pages = []

    for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
    }

    return (
        <nav
            aria-label="Page navigation example"
            className="flex flex-col items-cente mt-4"
        >
            <ul className="inline-flex -space-x-px text-sm ">
                {/* Botón de anterior */}
                <li>
                    <button
                        name='previous'
                        onClick={() => onPageChange(currentPage - 1)}
                        className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white shadow"
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                </li>

                {/* Botones de número de página */}
                {pages.map((page) => (
                    <li key={page}>
                        <button
                            name='page'
                            onClick={() => onPageChange(page)}
                            className={`shadow flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === page
                                ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:bg-gray-700 dark:text-white'
                                : 'text-gray-500 bg-white dark:bg-gray-800'
                                }`}
                            aria-current={currentPage === page ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    </li>
                ))}

                {/* Botón de siguiente */}
                <li>
                    <button
                        name='next'
                        onClick={() => onPageChange(currentPage + 1)}
                        className="shadow flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </li>
            </ul>
        </nav>
    )
}

export default Pagination
