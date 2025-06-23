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

  if (!badge) return null;

  const badgeName = badge.name || "Thành tựu";
  const badgeDescription = badge.condition || "Mô tả thành tựu chưa có sẵn";
  const defaultShareMessage = `Mình vừa nhận được huy hiệu "${badgeName}" trên Exhela!`;

  const badgeId =
    badge.id ||
    badge._id ||
    (badge.badge_id && badge.badge_id._id) ||
    badge.badge_id;

  return (
    <>
      <Modal
        title={badgeName}
        open={detailVisible}
        onCancel={onCloseDetail}
        className="achievement-modal"
        footer={[
          <Button
            key="share"
            type="primary"
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-300"
            onClick={() => onShare(badge)}
            disabled={!badge.earned}
          >
            Chia sẻ
          </Button>,
          <Button
            key="close"
            onClick={onCloseDetail}
            className="hover:border-blue-300 transition-all duration-300"
          >
            Đóng
          </Button>,
        ]}
      >
        <div className="flex flex-col items-center mb-4">
          <div className="mb-4 p-4 bg-gradient-to-br from-white to-gray-50 rounded-full shadow-md hover:shadow-xl border border-gray-200 hover:border-blue-300 transition-all duration-300">
            <BadgeIcon
              icon={badge.icon || "trophy"}
              url_image={badge.url_image}
              size="2xl"
              earned={badge.earned}
            />
          </div>
          <p className="text-center mb-2 text-gray-600">{badgeDescription}</p>
          {badge.pointValue > 0 && (
            <p className="text-blue-500 font-semibold">
              +{badge.pointValue} điểm
            </p>
          )}
          {badge.earned && badge.earnedAt && (
            <p className="text-gray-500 text-sm mt-2">
              Đạt được vào ngày{" "}
              {new Date(badge.earnedAt).toLocaleDateString("vi-VN")}
            </p>
          )}
          {!badge.earned && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 hover:border-yellow-300 rounded-md text-yellow-800 text-sm shadow-sm hover:shadow-md transition-all duration-300">
              <p className="font-medium mb-1">Chưa đạt được</p>
              <p>Hãy hoàn thành yêu cầu bên trên để nhận huy hiệu này.</p>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        title="Chia sẻ thành tựu"
        open={shareVisible}
        onCancel={onCloseShare}
        className="achievement-modal"
        footer={null}
      >
        <p className="text-gray-600 mb-4">
          Chia sẻ thành tựu của bạn với bạn bè!
        </p>

        <div className="mb-4">
          <div
            className={`flex items-center justify-center ${
              lightTheme
                ? "bg-gradient-to-r from-blue-100 via-blue-200 to-indigo-200"
                : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            } p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300`}
          >
            <div
              className={`${
                lightTheme
                  ? "bg-white shadow-lg"
                  : "bg-white/10 backdrop-blur-md"
              } p-4 rounded-xl border ${
                lightTheme
                  ? "border-blue-200 hover:border-blue-300"
                  : "border-white/20"
              } w-full max-w-md transition-all duration-300`}
            >
              <div className="flex items-center mb-3">
                <div className="mr-3 p-2 rounded-full bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-blue-300 transition-all duration-300">
                  <BadgeIcon
                    icon={badge.icon || "trophy"}
                    url_image={badge.url_image}
                    size="xl"
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
                  lightTheme
                    ? "bg-gradient-to-br from-blue-50 to-blue-100"
                    : "bg-white/10"
                } p-2 rounded-lg shadow-sm border border-blue-200 hover:border-blue-300 text-center transition-all duration-300`}
              >
                <p
                  className={`text-sm ${
                    lightTheme ? "text-slate-800" : "text-white"
                  }`}
                >
                  {defaultShareMessage}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Form
          initialValues={{ content: defaultShareMessage }}
          onFinish={async ({ content }) => {
            try {
              setSharing(true);
              await shareBadge(badgeId, content);
              message.success("Chia sẻ thành công!");
              onCloseShare();
            } catch (err) {
              console.error("Lỗi chia sẻ:", err);
              message.error(
                err?.response?.data?.message || "Chia sẻ thất bại!"
              );
            } finally {
              setSharing(false);
            }
          }}
          className="w-full"
        >
          <Form.Item
            name="content"
            rules={[
              { required: true, message: "Vui lòng nhập nội dung chia sẻ" },
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Nhập lời chia sẻ kèm huy hiệu của bạn"
              className="border border-gray-200 hover:border-blue-300 rounded-lg transition-all duration-300 focus:border-blue-400 focus:shadow-md"
            />
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button
              onClick={onCloseShare}
              className="hover:border-blue-300 transition-all duration-300"
            >
              Huỷ
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-300"
              loading={sharing}
            >
              Chia sẻ
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default AchievementModals;
