import {
  FaUser,
  FaMoneyBill,
  FaCalendarCheck,
  FaPiggyBank,
  FaCommentDots,
} from "react-icons/fa";

const cardData = [
  {
    icon: <FaUser />,
    label: "Người dùng",
    key: "users",
    gradient: "from-[#6a5af9] to-[#1ecbe1]",
  },
  {
    icon: <FaMoneyBill />,
    label: "Doanh thu",
    key: "revenue",
    gradient: "from-[#1ecbe1] to-[#6a5af9]",
  },
  {
    icon: <FaCalendarCheck />,
    label: "Ngày không hút",
    key: "smokeFreeDays",
    gradient: "from-[#6a5af9] to-[#a259f7]",
  },
  {
    icon: <FaPiggyBank />,
    label: "Tiền tiết kiệm",
    key: "moneySaved",
    gradient: "from-[#a259f7] to-[#1ecbe1]",
  },
  {
    icon: <FaCommentDots />,
    label: "Feedback",
    key: "feedbacks",
    gradient: "from-[#1ecbe1] to-[#6a5af9]",
  },
];

export default function Cards({ stats = {} }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-6">
      {cardData.map((c) => (
        <div
          key={c.key}
          className={`group relative bg-gradient-to-br ${c.gradient} p-6 rounded-3xl shadow-xl transition-transform transform hover:scale-105 hover:rotate-[1deg] cursor-pointer`}
        >
          {/* Glass Effect */}
          <div className="absolute inset-0 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 z-0" />{" "}
          {/* Animation Glow on Hover */}
          <div
            className={`absolute -inset-1 rounded-3xl bg-gradient-to-br ${c.gradient} opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl z-0`}
          />
          <div className="relative z-10 flex flex-col items-center text-white animate-fade-in">
            <div className="text-4xl mb-3 animate-pulse">{c.icon}</div>
            <div className="text-3xl font-extrabold tracking-tight mb-1 drop-shadow-md">
              {stats[c.key] ?? 0}
            </div>
            <div className="text-sm font-medium tracking-wide uppercase">
              {c.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
