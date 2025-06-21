import React from "react";
import {
  BadgeCheck,
  Calendar,
  CigaretteOff,
  CircleDollarSign,
  Clock,
  Heart,
  HeartPlus,
  Trophy,
  Users,
} from "lucide-react";

/**
 * Component hiển thị icon cho badge dựa trên tên hoặc URL
 * @param {Object} props
 * @param {string} props.icon - Tên icon hoặc URL hình ảnh
 * @param {string} props.size - Kích thước icon (sm, md, lg)
 * @param {string} props.className - CSS classes bổ sung
 * @param {boolean} props.earned - Trạng thái đã đạt được hay chưa
 * @param {string} props.url_image - URL hình ảnh cho badge (thay thế cho icon nếu có)
 */
const BadgeIcon = ({
  icon,
  url_image,
  size = "md",
  className = "",
  earned = true,
}) => {
  // Ưu tiên sử dụng url_image nếu có
  const imageUrl = url_image || icon;

  // Nếu có URL hình ảnh
  if (
    imageUrl &&
    (imageUrl.startsWith("http") || imageUrl.startsWith("data:"))
  ) {
    return (
      <img
        src={imageUrl}
        alt="Badge icon"
        className={`${getSizeClass(
          size
        )} ${className} rounded-full object-cover border-2 shadow-md transition-all duration-300 ${
          earned ? "" : "filter grayscale-[40%]"
        }`}
        style={{
          borderColor: earned
            ? "rgba(59, 130, 246, 0.8)"
            : "rgba(59, 130, 246, 0.3)",
          filter: earned ? "brightness(1.05)" : "brightness(0.9)",
        }}
      />
    );
  }

  // Giá trị size mặc định
  const sizeClass = getSizeClass(size);
  const combinedClassName = `${sizeClass} ${className}`;
  // Nếu icon là emoji hoặc text
  if (icon && (icon.length <= 2 || icon.match(/\p{Emoji}/u))) {
    return (
      <span
        className={`flex items-center justify-center rounded-full ${
          earned ? "bg-blue-100" : "bg-blue-50"
        } ${combinedClassName} transition-all duration-300`}
        style={{
          aspectRatio: "1/1",
          opacity: earned ? 1 : 0.8,
          filter: earned ? "none" : "grayscale(40%)",
        }}
      >
        <span className="text-2xl">{icon}</span>
      </span>
    );
  }
  // Map tên icon đến component tương ứng
  const IconComponent = (() => {
    switch (icon) {
      case "clock":
        return Clock;
      case "calendar":
        return Calendar;
      case "heart":
        return Heart;
      case "heart-plus":
        return HeartPlus;
      case "circle-dollar-sign":
        return CircleDollarSign;
      case "cigarette-off":
        return CigaretteOff;
      case "badge-check":
        return BadgeCheck;
      case "users":
        return Users;
      case "trophy":
      default:
        return Trophy;
    }
  })();

  // Render icon with circular background
  return (
    <div
      className={`flex items-center justify-center rounded-full transition-all duration-300 ${
        earned
          ? "bg-gradient-to-br from-blue-50 to-blue-200"
          : "bg-gradient-to-br from-gray-100 to-blue-100/50"
      } ${combinedClassName}`}
      style={{
        aspectRatio: "1/1",
        padding: "15%",
        opacity: earned ? 1 : 0.85,
        filter: earned ? "none" : "grayscale(30%)",
      }}
    >
      <IconComponent
        className={`w-full h-full ${
          earned ? "text-blue-600" : "text-blue-400"
        }`}
      />
    </div>
  );
};

// Helper function để xác định kích thước CSS dựa trên prop size
const getSizeClass = (size) => {
  switch (size) {
    case "xs":
      return "w-6 h-6";
    case "sm":
      return "w-8 h-8";
    case "md":
      return "w-10 h-10";
    case "lg":
      return "w-12 h-12";
    case "xl":
      return "w-16 h-16";
    case "2xl":
      return "w-20 h-20";
    default:
      return "w-10 h-10"; // Default to medium
  }
};

export default BadgeIcon;
