type TablePaginationProps = {
  pageNumber: number;
  currentPage: number; // start from 0
  onChange: (nextPage: number) => void;
};

export const TablePagination: React.FC<TablePaginationProps> = props => {
  const { pageNumber, currentPage, onChange } = props;

  const pageEles = Array(pageNumber)
    .fill(1)
    .map((_, i) => {
      const isCurrent = currentPage === i;
      const onClick = () => onChange(i);
      return (
        <span
          key={i}
          style={{ fontWeight: isCurrent ? 'bold' : 'normal' }}
          onClick={onClick}>
          {i + 1}
        </span>
      );
    });

  return (
    <div>
      <span onClick={() => onChange(Math.max(0, currentPage - 1))}>prev</span>
      {pageEles}
      <span onClick={() => onChange(Math.min(pageNumber - 1, currentPage + 1))}>
        next
      </span>
    </div>
  );
};
