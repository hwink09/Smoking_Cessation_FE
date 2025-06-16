import React from "react";
import { Card } from "antd";
import { Info } from "lucide-react";

const FAQList = ({ faqs }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
      <Info className="h-6 w-6 text-blue-400" />
      Frequently Asked Questions
    </h2>
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <Card
          key={index}
          className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg"
          title={
            <span className="text-white font-semibold">{faq.question}</span>
          }
        >
          <p className="text-gray-300">{faq.answer}</p>
        </Card>
      ))}
    </div>
  </div>
);

export default FAQList;
