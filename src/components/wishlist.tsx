import type { Product } from "../utils/Product";
import { useWishlist } from "react-use-wishlist";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorderOutlined from "@mui/icons-material/FavoriteBorderOutlined";

type WishlistItem = Omit<Product, "id"> & {
  id: string;
  price: number;
};

type Props = {
  product: Product;
};

const LibraryWishlistButton = ({ product }: Props) => {
  const { items, addWishlistItem, removeWishlistItem } =
    useWishlist();

  if (!product?.id) return null;

  const productId = String(product.id);

  const isInWishlist = items.some(
    (item) => item.id === productId
  );

  const toggleWishlist = (): void => {
    if (isInWishlist) {
      removeWishlistItem(productId);
    } else {
      addWishlistItem({
        ...product,
        id: productId,
        price: product.price ?? 0,
      });
    }
  };

  return (
    <button onClick={toggleWishlist} aria-label="Toggle wishlist">
      {isInWishlist ? (
        <Favorite color="error" sx={{ fontSize: 8 }} />
      ) : (
        <FavoriteBorderOutlined sx={{ fontSize: 8 }} />
      )}
    </button>
  );
};

export default LibraryWishlistButton;
