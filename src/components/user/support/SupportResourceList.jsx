import React from "react";
import { Card, Button } from "antd";
import { MessageSquare } from "lucide-react";

const SupportResourceList = ({ resources }) => (
  <div>
    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
      <MessageSquare className="h-5 w-5" />
      Support Resources
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {resources.map((resource) => (
        <Card
          key={resource.id}
          hoverable
          className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
              {resource.icon}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">
                {resource.title}
              </h3>
              <p className="text-gray-300 mb-4">{resource.description}</p>
              {resource.type === "phone" && (
                <Button
                  type="primary"
                  size="large"
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Call {resource.contact}
                </Button>
              )}
              {resource.type === "link" && (
                <Button
                  type="primary"
                  size="large"
                  className="bg-green-500 hover:bg-green-600"
                >
                  Visit Now
                </Button>
              )}
              {resource.type === "schedule" && (
                <Button
                  type="primary"
                  size="large"
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  Schedule Session
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export default SupportResourceList;
