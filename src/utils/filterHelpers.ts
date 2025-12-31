import type { Dispatch, SetStateAction } from "react";
import type { URLSearchParamsInit } from "react-router-dom";

type Price = {
  min: number | null;
  max: number | null;
};

export function createFilterHandlers({
  params,
  setParams,
  setSelectedBrands,
  setSelectedSizes,
  setSelectedColors,
  setPrice,
}: {
  params: URLSearchParams;
  setParams: (next: URLSearchParamsInit) => void;
  setSelectedBrands: Dispatch<SetStateAction<string[]>>;
  setSelectedSizes: Dispatch<SetStateAction<string[]>>;
  setSelectedColors: Dispatch<SetStateAction<string[]>>;
  setPrice: Dispatch<SetStateAction<Price>>;
}) {
  function resetPage() {
    const next = new URLSearchParams(params);
    next.set("page", "1");
    setParams(next);
  }

  function goToPage(newPage: number) {
    const next = new URLSearchParams(params);
    next.set("page", String(newPage));
    setParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBrandChange(brandId: string) {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
    resetPage();
  }

  function handlePriceChange(type: "min" | "max", value: string) {
    setPrice((prev) => ({
      ...prev,
      [type]: value === "" ? null : Number(value),
    }));
    resetPage();
  }

  function handleSizeToggle(size: string) {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    resetPage();
  }

  function handleColorToggle(color: string) {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
    resetPage();
  }

  return {
    goToPage,
    resetPage,
    handleBrandChange,
    handlePriceChange,
    handleSizeToggle,
    handleColorToggle,
  };
}
