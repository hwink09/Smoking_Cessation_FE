import { Card } from "antd"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function PlanCard({ id, image, title, description, delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setIsVisible(true)
      },
      300 + delay * 200,
    )

    return () => clearTimeout(timer)
  }, [delay])

  return (
    <Card
      className={`h-full border-0 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{
        transition: "all 0.5s ease",
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        height: "100%", 
        display: "flex", 
        flexDirection: "column", 
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      bodyStyle={{ padding: 0, flex: 1 }} 
    >
      <div className="relative overflow-hidden group cursor-pointer">
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent 
          opacity-0 group-hover:opacity-100 transition-all duration-300 
          flex items-end justify-center pb-6 z-10"
        >
          <Link to={`/quit-plan-detail/${id}`}>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-full 
            flex items-center gap-2 font-medium transform translate-y-full 
            group-hover:translate-y-0 transition-transform duration-300 ease-out"
          >
            Xem chi tiết <ArrowRight className="w-4 h-4" />
          </button>
          </Link>
        </div>
        
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-700 
          group-hover:scale-110"
        />
      </div>

      <div className="p-6">
        <div
          className="w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mb-4"
          style={{
            animation: isVisible ? "width-expand 1s ease-out forwards" : "none",
          }}
        ></div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>

      <style jsx>{`
        @keyframes width-expand {
          from {
            width: 0;
          }
          to {
            width: 48px;
          }
        }
      `}</style>
    </Card>
  )
}

export default PlanCard
