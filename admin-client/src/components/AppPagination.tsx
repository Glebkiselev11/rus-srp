interface AppPaginationProps {
  limit: number;
  offset: number;
  count: number;
  changeOffsetHandler: (offset: number) => void
}

export function AppPagination({ limit, offset, count, changeOffsetHandler }: AppPaginationProps) {
  const currentPage = (offset / limit) + 1;

  const pages: Array<number> =
    Array(Math.ceil(count / limit))
      .fill(0)
      .map((_, i) => i + 1);

  const handleClickOnPage = (page: number) => {
    changeOffsetHandler(limit * (page - 1));
  };

  return (
    <div>
      {pages.map(page => (
        <button
          key={page}
          disabled={page === currentPage}
          className={`border mr-2 h-10 w-10 ${currentPage === page ? "bg-purple-200" : ""}`}
          onClick={() => handleClickOnPage(page)}
        >
          {page}
        </button>
      ))
      }
    </div >
  );
}
