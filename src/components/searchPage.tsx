import { useSearchParams } from "react-router-dom";
import products from "../data/products.json";
import SearchSummary from "../components/SearchSummary";
import FiltersPanel from "../components/FiltersPanel";
import ResultsGrid from "../components/ResultsGrid";
import Pagination from "../components/Pagination";
import { tokenize } from "../utils/SearchHelper";
import { sortProducts } from "../utils/dropdownhelper";
import "../styles/searchPage.css";
import { useState, useEffect } from "react";
import { createFilterHandlers } from "../utils/filterHelpers";
import { FilterToggleButton } from "../components/filterBtn";
import {
  filterByBrands,
  filterByPrice,
  filterBySizes,
  filterByColors,
  filterByRating,
} from "../utils/productFilters";

type SearchPageProps = {
  sortOption: string;
};

const PAGE_SIZE = 10;

//function to display no results
export function EmptyState({ query }: { query?: string }) {
  return (
    <section className="srp-empty">
      <h2>No results found</h2>
      {query ? (
        <p>
          We couldn’t find anything matching <strong>“{query}”</strong>.
        </p>
      ) : (
        <p>No products available.</p>
      )}
    </section>
  );
}

//function to return search results
export function searchProducts(products: any[], query: string) {
  if (!query) return products;

  const queryTokens = tokenize(query);

  return products.filter((product) => {
    const haystackTokens = tokenize(
      [
        product.name,
        product.description,
        product.categoryId,
        product.brandId,
        product.gender,
        ...(product.keywords ?? []),
        ...(product.tags ?? []),
      ].join(" ")
    );

    return queryTokens.some((token) => haystackTokens.includes(token));
  });
}

//function to render the search page
export default function SearchPage({ sortOption }: SearchPageProps) {
  {
    /*setting states*/
  }

  const [isloading, setisloading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const page = Number(params.get("page") ?? "1");
  const [price, setPrice] = useState<{
    min: number | null;
    max: number | null;
  }>({
    min: null,
    max: null,
  });

  // use effect to simulate the the loading changing.
  useEffect(() => {
    setisloading(true);

    const id = setTimeout(() => {
      setisloading(false);
    }, 0);

    return () => clearTimeout(id);
  }, [
    query,
    selectedBrands,
    selectedSizes,
    selectedColors,
    selectedRating,
    price.min,
    price.max,
    sortOption,
    page,
  ]);

  {
    /*setting results*/
  }
  let results = searchProducts(products.products, query);
  results = filterByBrands(results, selectedBrands);
  results = filterByPrice(results, price.min, price.max);
  results = filterBySizes(results, selectedSizes);
  results = filterByColors(results, selectedColors);
  results = filterByRating(results, selectedRating);
  results = sortProducts(results, sortOption);

  const hasResults = results.length > 0;
  const totalPages = Math.ceil(results.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const paginatedResults = results.slice(start, start + PAGE_SIZE);

  {
    /*passing state updater through helpers*/
  }
  const {
    goToPage,
    handleBrandChange,
    handlePriceChange,
    handleSizeToggle,
    handleColorToggle,
  } = createFilterHandlers({
    params,
    setParams,
    setSelectedBrands,
    setSelectedSizes,
    setSelectedColors,
    setPrice,
  });

  return (
    <main className="srp">
      <div className="sr-top">
        <SearchSummary query={query} count={results.length} />

        <FilterToggleButton
          isOpen={filtersOpen}
          onToggle={() => setFiltersOpen((prev) => !prev)}
        />
      </div>

      <div className={`srp__content ${filtersOpen ? "with-filters" : ""}`}>
        <FiltersPanel
          selectedBrands={selectedBrands}
          onBrandChange={handleBrandChange}
          price={price}
          onPriceChange={handlePriceChange}
          selectedSizes={selectedSizes}
          onSizeToggle={handleSizeToggle}
          selectedColors={selectedColors}
          onColorToggle={handleColorToggle}
          selectedRating={selectedRating}
          onRatingChange={setSelectedRating}
          products={products.products}
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          isloading={isloading}
        />

        {hasResults ? (
          <ResultsGrid products={paginatedResults} isloading={isloading} />
        ) : (
          <EmptyState query={query} />
        )}
      </div>

      {hasResults && totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
      )}
    </main>
  );
}
