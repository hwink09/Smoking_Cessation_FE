import React from "react";

function OverviewCards({ overviewCards }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {overviewCards.map((card, index) => {
        // Sử dụng icon như một component class, không phải JSX element
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.bgColor} p-3 rounded-xl shadow-md`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl">{card.emoji}</span>
            </div>
            <h3 className="text-gray-300 text-sm font-medium mb-2">
              {card.title}
            </h3>
            <div className="flex items-baseline">
              <span className={`${card.textColor} text-3xl font-bold`}>
                {typeof card.value === "string"
                  ? card.value
                  : card.value.toLocaleString("en-US")}
              </span>
              {card.unit && (
                <span className="text-gray-400 text-sm ml-2">{card.unit}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default OverviewCards;
