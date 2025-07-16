import React from "react";
import { Progress, Typography, Card } from "antd";
import { getProgressColor, getProgressStatusText } from "~/utils/formHelpers";

const { Text } = Typography;

/**
 * Generic progress component for tracking completion
 */
const ProgressTracker = ({
  percent = 0,
  completed = 0,
  total = 0,
  label = "Tiến độ",
  showNumbers = true,
  showPercent = true,
  showStatus = true,
  size = "default",
  strokeColor,
  className = "",
  ...props
}) => {
  const finalPercent = Math.min(Math.max(percent, 0), 100);
  const progressColor = strokeColor || getProgressColor(finalPercent);
  const statusText = getProgressStatusText(finalPercent);

  return (
    <Card className={`${className}`} {...props}>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Text strong className="text-sm">
            {label}
          </Text>
          {showStatus && (
            <Text className="text-xs text-gray-500">{statusText}</Text>
          )}
        </div>

        <Progress
          percent={finalPercent}
          strokeColor={progressColor}
          size={size}
          showInfo={showPercent}
          className="mb-2"
        />

        {showNumbers && (
          <div className="flex justify-between items-center">
            <Text className="text-xs text-gray-500">
              Hoàn thành: {completed}/{total}
            </Text>
            <Text className="text-xs text-gray-500">
              {finalPercent.toFixed(0)}%
            </Text>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProgressTracker;
