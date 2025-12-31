export function filterByBrands(products: any[], selectedBrands: string[]) {
  if (selectedBrands.length === 0) return products;
  return products.filter((p) => selectedBrands.includes(p.brandId));
}

export function filterByPrice(
  products: any[],
  min: number | null,
  max: number | null
) {
  return products.filter((p) => {
    const price = p.price;
    if (min !== null && price < min) return false;
    if (max !== null && price > max) return false;
    return true;
  });
}

export function filterBySizes(products: any[], sizes: string[]) {
  if (sizes.length === 0) return products;
  return products.filter((p) =>
    p.variants?.some((v: { size: string }) => sizes.includes(v.size))
  );
}

export function filterByColors(products: any[], colors: string[]) {
  if (colors.length === 0) return products;
  return products.filter((p) =>
    p.variants?.some((v: { color: string }) => colors.includes(v.color))
  );
}

export function filterByRating(products: any[], minRating: number | null) {
  if (!minRating) return products;
  return products.filter((p) => p.rating >= minRating);
}
