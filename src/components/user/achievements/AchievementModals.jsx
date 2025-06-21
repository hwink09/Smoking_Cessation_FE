import React, { useState } from "react";
import { Modal, Button, message, Input, Form } from "antd";
import BadgeIcon from "../../ui/BadgeIcon";

const AchievementModals = ({
  badge,
  detailVisible,
  shareVisible,
  onCloseDetail,
  onCloseShare,
  onShare,
  shareBadge,
  lightTheme,
}) => {
  const [sharing, setSharing] = useState(false);

  // Don't render modals if no badge is selected
  if (!badge) return null;

  // Safety measures to prevent errors on null badge properties
  const badgeName = badge.name || "Achievement";
  const badgeDescription =
    badge.condition || "Achievement description not available";

  // Default share message
  const defaultShareMessage = `I've earned the "${badgeName}" badge on Exhela!`;

  return (
    <>
      {" "}
      <Modal
        title={badgeName}
        open={detailVisible}
        onCancel={onCloseDetail}
        footer={[
          <Button
            key="share"
            type="primary"
            onClick={() => onShare(badge)}
            disabled={!badge.earned}
          >
            Share
          </Button>,
          <Button key="close" onClick={onCloseDetail}>
            Close
          </Button>,
        ]}
      >
        <div className="flex flex-col items-center mb-4">
          <div className="mb-4">
            {" "}
            <BadgeIcon
              icon={badge?.icon || "trophy"}
              url_image={badge?.url_image}
              size="2xl"
              earned={badge?.earned}
            />
          </div>{" "}
          <p className="text-center mb-2">{badgeDescription}</p>
          {badge.pointValue > 0 && (
            <p className="text-blue-500 font-semibold">
              +{badge.pointValue} points
            </p>
          )}
          {badge.earned && badge.earnedAt && (
            <p className="text-gray-500 text-sm mt-2">
              Earned on {new Date(badge.earnedAt).toLocaleDateString()}
            </p>
          )}
          {!badge.earned && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
              <p className="font-medium mb-1">Achievement not yet earned</p>
              <p>
                Complete the requirements described above to earn this badge.
              </p>
            </div>
          )}
        </div>
      </Modal>{" "}
      <Modal
        title="Share Your Achievement"
        open={shareVisible}
        onCancel={onCloseShare}
        footer={null}
      >
        <p>Share your achievement with friends!</p>
        <div className="mb-4">
          {" "}
          <div
            className={`flex items-center justify-center ${
              lightTheme
                ? "bg-gradient-to-r from-blue-100 via-blue-200 to-indigo-200"
                : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            } p-6 rounded-lg`}
          >
            <div
              className={`${
                lightTheme
                  ? "bg-white shadow-lg"
                  : "bg-white/10 backdrop-blur-md"
              } p-4 rounded-xl border ${
                lightTheme ? "border-blue-200" : "border-white/20"
              } w-full max-w-md`}
            >
              <div className="flex items-center mb-3">
                {" "}
                <div className="mr-3">
                  {" "}
                  <BadgeIcon
                    icon={badge?.icon || "trophy"}
                    url_image={badge?.url_image}
                    size="2xl"
                    className={lightTheme ? "text-blue-600" : "text-white"}
                    earned={true}
                  />
                </div>
                <div>
                  <h3
                    className={`${
                      lightTheme ? "text-slate-800" : "text-white"
                    } font-bold`}
                  >
                    {badgeName}
                  </h3>
                  <p
                    className={`text-sm ${
                      lightTheme ? "text-slate-600" : "text-gray-200"
                    }`}
                  >
                    {badgeDescription}
                  </p>
                </div>
              </div>
              <div
                className={`${
                  lightTheme ? "bg-blue-50" : "bg-white/10"
                } p-2 rounded text-center`}
              >
                <p
                  className={`text-sm ${
                    lightTheme ? "text-slate-800" : "text-white"
                  }`}
                >
                  I've earned the "{badgeName}" achievement on Exhela!
                </p>
              </div>
            </div>
          </div>
        </div>{" "}
        <div className="flex justify-center gap-4 my-4">
          <Form
            initialValues={{ content: defaultShareMessage }}
            onFinish={async (values) => {
              try {
                setSharing("sharing");
                // Use the backend API structure format - handle different ID formats
                const badgeId =
                  badge.id ||
                  badge._id ||
                  (badge.badge_id && badge.badge_id._id) ||
                  badge.badge_id;
                await shareBadge(badgeId, values.content);
                message.success("Badge shared successfully!");
                // Close the modal after successful share
                onCloseShare();
              } catch (err) {
                console.error("Share error:", err);
                message.error(
                  err?.response?.data?.message || "Failed to share badge"
                );
              } finally {
                setSharing(false);
              }
            }}
          >
            <Form.Item
              name="content"
              rules={[
                { required: true, message: "Please write a message to share" },
              ]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Write a message to share with your badge"
              />
            </Form.Item>

            <div className="flex justify-end gap-2">
              <Button onClick={onCloseShare}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-blue-600"
                loading={sharing === "sharing"}
              >
                Share Badge
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default AchievementModals;
