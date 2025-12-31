import "../styles/pagination.css";

type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export default function Pagination({
  page,
  totalPages,
  onChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="pagination">
      <button disabled={page === 1} onClick={() => onChange(page - 1)}>
        Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={p === page ? "active" : ""}
          disabled={p === page}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}

      <button disabled={page === totalPages} onClick={() => onChange(page + 1)}>
        Next
      </button>
    </nav>
  );
}
