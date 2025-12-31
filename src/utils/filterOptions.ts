export function getPriceBounds(products: any[]) {
  const prices = products.map((p) => p.salePrice ?? p.price);
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  };
}

export function getAvailableSizes(products: any[]) {
  const sizes = new Set<string>();
  products.forEach((p) => p.variants?.forEach((v: any) => sizes.add(v.size)));
  return Array.from(sizes).sort();
}

export function getAvailableColors(products: any[]) {
  const colors = new Set<string>();
  products.forEach((p) => p.variants?.forEach((v: any) => colors.add(v.color)));
  return Array.from(colors).sort();
}

export function getRatingSteps() {
  return [4, 3, 2];
}
