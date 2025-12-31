import EmptyState from "./searchPage";
import StarRating from "./starRating";
import type { Product } from "../utils/Product";
import LibraryWishlistButton from "./wishlist";
import "../styles/results.css";
import { Skeleton } from "@mui/material";

type ResultsGridProps = {
  products: Product[];
  isloading: boolean;
};

function ResultsSkeletonCard() {
  return (
    <li className="results-card">
      <Skeleton variant="rectangular" height={180} />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="40%" />
      <Skeleton variant="text" />
      <Skeleton variant="text" width="60%" />
    </li>
  );
}

export default function ResultsGrid({ products, isloading }: ResultsGridProps) {
  if (isloading) {
    return (
      <section className="srp-results">
        <ul className="results-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <ResultsSkeletonCard key={i} />
          ))}
        </ul>
      </section>
    );
  }

  if (products.length === 0) {
    return <EmptyState sortOption={""} />;
  }

  return (
    <section className="srp-results">
      <ul className="results-grid">
        {products.map((product) => (
          <li key={product.id} className="results-card">
            <img src={product.images?.[0]} alt={product.name} loading="lazy" />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <p>{product.description}</p>
            <span>
              <StarRating
                rating={product.rating}
                reviewCount={product.reviewCount}
              />
            </span>
            <p style={{ fontSize: 8 }}>
              Wishlist {<LibraryWishlistButton product={product} />}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}