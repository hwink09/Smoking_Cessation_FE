import { Typography, Alert, Card, Spin } from "antd";

const { Title, Paragraph, Text } = Typography;

export const StageLoadingSkeleton = ({ text }) => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <Spin size="large" />
      <Text className="mt-4 block text-gray-600">{text}</Text>
    </div>
  </div>
);

export const StageErrorCard = ({ message, description }) => (
  <div className="p-4">
    <Alert
      type="error"
      message={message}
      description={description}
      showIcon
      className="rounded-lg border-0 bg-red-50"
    />
  </div>
);

export const StageEmptyCard = ({ title, desc }) => (
  <div className="text-center p-8">
    <Title level={4} className="text-gray-600 mb-4">
      {title}
    </Title>
    <Paragraph className="text-gray-500 max-w-md mx-auto">{desc}</Paragraph>
  </div>
);

// Optional: Nếu bạn dùng trong giao diện toàn trang
export const SkeletonCard = ({ text }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-4xl w-full">
      <Card className="p-8 shadow-lg rounded-lg text-center py-20">
        <Spin size="large" />
        <Text className="mt-6 text-lg text-gray-600 font-medium">{text}</Text>
      </Card>
    </div>
  </div>
);

export const ErrorCard = ({ message, description }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-4xl w-full">
      <Card className="p-8 shadow-lg rounded-lg">
        <Alert
          type="error"
          message={message}
          description={description}
          showIcon
          className="rounded-lg border-0 bg-red-50"
        />
      </Card>
    </div>
  </div>
);

export const EmptyCard = ({ title, desc }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-4xl w-full">
      <Card className="p-8 shadow-lg rounded-lg text-center py-20">
        <Title level={3} className="text-gray-600 mb-4">
          {title}
        </Title>
        <Paragraph className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
          {desc}
        </Paragraph>
      </Card>
    </div>
  </div>
);
