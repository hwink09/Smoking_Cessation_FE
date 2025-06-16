import React from "react";
import { Card, Button, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { BookOpen } from "lucide-react";

function JournalTab({
  journalEntries,
  handleAddJournalEntry,
  handleEditJournalEntry,
  handleDeleteJournalEntry,
  getMoodIcon,
  getHealthStatusColor,
}) {
  return (
    <div className="grid gap-4">
      {journalEntries.length === 0 ? (
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Journal Entries Yet
          </h3>
          <p className="text-gray-400 mb-4">
            Start documenting your smoke-free journey!
          </p>
          <Button
            type="primary"
            onClick={handleAddJournalEntry}
            className="bg-gradient-to-r from-green-500 to-blue-500 border-none"
          >
            Create Your First Entry
          </Button>
        </Card>
      ) : (
        journalEntries.map((entry) => (
          <Card
            key={entry.id}
            className="bg-white/10 backdrop-blur-sm border border-white/20"
            actions={[
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleEditJournalEntry(entry)}
                className="text-blue-400 hover:text-blue-300"
              >
                Edit
              </Button>,
              <Popconfirm
                title="Are you sure you want to delete this entry?"
                onConfirm={() => handleDeleteJournalEntry(entry.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  className="text-red-400 hover:text-red-300"
                >
                  Delete
                </Button>
              </Popconfirm>,
            ]}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-white">{entry.date}</h3>
              <div className="flex items-center space-x-2">
                {getMoodIcon(entry.mood)}
                <span
                  className="px-2 py-1 rounded text-xs font-medium text-white"
                  style={{
                    backgroundColor: getHealthStatusColor(entry.healthStatus),
                  }}
                >
                  {entry.healthStatus?.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <span className="text-gray-400 text-sm">Cigarettes</span>
                <p className="text-white font-medium">
                  {entry.cigarettes || 0}
                </p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Mood</span>
                <p className="text-white font-medium">{entry.mood}/10</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Cravings</span>
                <p className="text-white font-medium">
                  {entry.cravings || 0}/10
                </p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Exercise</span>
                <p className="text-white font-medium">
                  {entry.exercise || 0} min
                </p>
              </div>
            </div>
            {entry.notes && (
              <div>
                <span className="text-gray-400 text-sm">Notes:</span>
                <p className="text-white mt-1">{entry.notes}</p>
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  );
}

export default JournalTab;
