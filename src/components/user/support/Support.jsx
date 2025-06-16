import React from "react";
import { Divider } from "antd";
import SupportHeader from "./SupportHeader";
import SupportResourceList from "./SupportResourceList";
import FAQList from "./FAQList";
import { Book, Users, MessageSquare, Phone } from "lucide-react";

// Mock support resources
const supportResources = [
  {
    id: 1,
    title: "24/7 Helpline",
    description: "Talk to a professional counselor anytime",
    icon: <Phone className="h-6 w-6 text-blue-500" />,
    contact: "0123456789",
    type: "phone",
  },
  {
    id: 2,
    title: "Community Forum",
    description: "Connect with others on their quitting journey",
    icon: <Users className="h-6 w-6 text-green-500" />,
    type: "link",
    url: "/community",
  },
  {
    id: 3,
    title: "Smoking Cessation Coach",
    description: "Schedule a one-on-one session",
    icon: <MessageSquare className="h-6 w-6 text-purple-500" />,
    type: "schedule",
  },
  {
    id: 4,
    title: "Health Resources",
    description: "Articles and resources about quitting smoking",
    icon: <Book className="h-6 w-6 text-yellow-500" />,
    type: "link",
    url: "/resources",
  },
];

// Mock frequently asked questions
const faqs = [
  {
    question: "What are withdrawal symptoms I might experience?",
    answer:
      "Common withdrawal symptoms include irritability, anxiety, difficulty concentrating, increased appetite, and strong cravings. Most physical symptoms peak within the first week and gradually decrease over time.",
  },
  {
    question: "How long does nicotine stay in my system?",
    answer:
      "Nicotine can be detected in your blood for about 1-3 days after use. However, nicotine byproducts like cotinine may be detectable for up to 1-2 weeks.",
  },
  {
    question: "What are some strategies to deal with cravings?",
    answer:
      "Try the 4 Ds: Delay (wait it out), Deep breathing, Drink water, and Distract yourself. Also, avoid triggers, chew gum, exercise, or call a support person.",
  },
  {
    question: "How soon will I feel health benefits after quitting?",
    answer:
      "Within 20 minutes, your heart rate drops. Within 12 hours, carbon monoxide levels normalize. Within 2 weeks to 3 months, circulation improves and lung function increases. Benefits continue to accumulate over years.",
  },
  {
    question: "What if I slip up and smoke?",
    answer:
      "Don't be too hard on yourself. One slip doesn't mean failure. Learn from what triggered the slip, recommit to quitting, and continue with your quit plan. Consider it a learning experience rather than a failure.",
  },
];

const Support = () => (
  <div className="min-h-screen p-2">
    <div className="max-w-7xl mx-auto">
      <SupportHeader />
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10">
        <SupportResourceList resources={supportResources} />
        <Divider className="border-white/20 my-8" />
        <FAQList faqs={faqs} />
      </div>
    </div>
  </div>
);

export default Support;
