import { Card, Skeleton } from "antd";

const LoadingSkeleton = ({
  cardCount = 6,
  gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <Card className="p-8 shadow-lg rounded-lg w-full max-w-6xl">
      <Skeleton.Input active size="large" className="w-96 h-12 mx-auto mb-12" />
      <div className={`grid ${gridCols} gap-4`}>
        {[...Array(cardCount)].map((_, i) => (
          <Card
            key={i}
            loading
            className="rounded-lg border-0 shadow-lg h-96"
          />
        ))}
      </div>
    </Card>
  </div>
);

export default LoadingSkeleton;
