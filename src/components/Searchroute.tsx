import Header from "./header";
import SearchPage from "./searchPage";

interface SearchRouteProps {
  sortOption: string;
  setSortOption: (value: string) => void;
}

export function SearchRoute({
  sortOption,
  setSortOption,
}: SearchRouteProps) {
  return (
    <>
      <Header
        sortOption={sortOption}
        onSortChange={setSortOption}
      />
      <SearchPage sortOption={sortOption} />
    </>
  );
}
