import React from "react";
import { BiFontSize } from "react-icons/bi";
import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  reviewCount: number;
}

const StarRating = ({ rating, reviewCount }: StarRatingProps) => {
  const totalStars = 5;

  const colors = {
    orange: "#FFD700",
    grey: "#a9a9a9",
  };

  return (
    <div
      className="star-rating"
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      <span style={{ marginRight: "8px", fontSize: 8 }}>
        {rating} / {totalStars}
      </span>

      {[...Array(totalStars)].map((_, index) => {
        const currentRatingValue = index + 1;

        return (
          <FaStar
            key={index}
            size={8}
            color={currentRatingValue <= rating ? colors.orange : colors.grey}
            style={{ marginRight: 4, cursor: "default" }}
          />
        );
      })}

      <span style={{ fontSize: 8 }}>({reviewCount})</span>
    </div>
  );
};

export default StarRating;
