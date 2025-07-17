import React, { useState, useEffect, useMemo } from "react";
import {
  Form,
  InputNumber,
  Button,
  List,
  Card,
  Input,
  message,
  Empty,
  Badge,
  Spin,
  Alert,
} from "antd";
import {
  PlusOutlined,
  BookOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Calendar, Cigarette, Heart, TrendingDown } from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
const { TextArea } = Input;

function calculateMoneySaved(smokingStatus, cigarettesSmoked) {
  if (!smokingStatus || smokingStatus.cigarettesPerDay <= 0) return 0;
  const { cigarettesPerDay, costPerPack, cigarettesPerPack } = smokingStatus;
  const reduction = Math.max(0, cigarettesPerDay - cigarettesSmoked);
  const costPerCigarette = costPerPack / cigarettesPerPack;
  return Math.round(reduction * costPerCigarette);
}

function calculateSmokeFreeStreak(entries) {
  const sorted = [...entries].sort(
    (a, b) => dayjs.utc(b.date).valueOf() - dayjs.utc(a.date).valueOf()
  );

  let streak = 0;
  for (const entry of sorted) {
    if ((entry.cigarettes_smoked || 0) === 0) streak++;
    else break;
  }
  return streak;
}

function JournalSection({
  entries = [],
  onSubmit,
  isLoading = false,
  currentStage,
  smokingStatus,
}) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  const entriesForDate = useMemo(() => {
    const filtered = entries.filter(
      (entry) => dayjs.utc(entry.date).format("YYYY-MM-DD") === selectedDate
    );
    console.log(`Filtering entries for date ${selectedDate}:`, {
      totalEntries: entries.length,
      filteredEntries: filtered.length,
      filtered: filtered.map((e) => ({
        id: e._id,
        date: e.date,
        formattedDate: dayjs.utc(e.date).format("YYYY-MM-DD"),
        cigarettes: e.cigarettes_smoked,
      })),
    });
    return filtered;
  }, [entries, selectedDate]);

  const existingEntryForDate = entriesForDate[0] || null;

  console.log(`Selected date: ${selectedDate}, Existing entry:`, {
    found: !!existingEntryForDate,
    entryId: existingEntryForDate?._id,
    entryDate: existingEntryForDate?.date,
    cigarettes: existingEntryForDate?.cigarettes_smoked,
  });

  const groupedEntries = useMemo(() => {
    const grouped = {};
    entries.forEach((entry) => {
      const dateKey = dayjs.utc(entry.date).format("YYYY-MM-DD");
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(entry);
    });
    return Object.entries(grouped).sort(
      ([a], [b]) => dayjs(b).valueOf() - dayjs(a).valueOf()
    );
  }, [entries]);

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      const cigarettesSmoked = values.cigarettes || 0;
      const moneySaved = calculateMoneySaved(smokingStatus, cigarettesSmoked);

      const entryData = {
        date: selectedDate, // YYYY-MM-DD format
        cigarettes: cigarettesSmoked,
        symptoms: values.symptoms || "",
        time: dayjs().format("HH:mm:ss"),
        isUpdate: !!existingEntryForDate,
        entryId: existingEntryForDate?._id,
        money_saved: moneySaved,
      };

      console.log("Creating entryData:", {
        originalSelectedDate: selectedDate,
        dateType: typeof selectedDate,
        entryDataDate: entryData.date,
        currentTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        isoString: new Date(selectedDate).toISOString(),
      });

      // Truyền method để backend biết dùng PUT hay POST
      const requestMethod = existingEntryForDate ? "PUT" : "POST";

      console.log("Submitting entry:", {
        method: requestMethod,
        isUpdate: entryData.isUpdate,
        entryId: entryData.entryId,
        selectedDate: selectedDate,
        date: entryData.date,
        existingEntry: existingEntryForDate,
        existingEntryDate: existingEntryForDate
          ? dayjs.utc(existingEntryForDate.date).format("YYYY-MM-DD")
          : null,
      });

      await onSubmit(entryData, requestMethod);
      message.success(
        existingEntryForDate
          ? "Cập nhật nhật ký thành công!"
          : "Ghi nhật ký thành công!"
      );

      // Reset form sau khi thành công để reflect changes
      setTimeout(() => {
        if (!existingEntryForDate) {
          form.resetFields();
        }
      }, 100);
    } catch (error) {
      message.error("Có lỗi xảy ra khi ghi nhật ký");
      console.error("Submit error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!submitting) {
      form.setFieldsValue(
        existingEntryForDate
          ? {
              cigarettes: existingEntryForDate.cigarettes_smoked || 0,
              symptoms: existingEntryForDate.health_status || "",
            }
          : { cigarettes: 0, symptoms: "" }
      );
    }
  }, [existingEntryForDate, selectedDate, form, submitting]);

  return (
    <div className="space-y-8">
      {/* Nhật ký */}
      <Card
        title={
          <div className="flex items-center">
            <BookOutlined className="text-2xl text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-blue-700 to-cyan-700 bg-clip-text text-transparent">
              Nhật Ký Hàng Ngày
            </h2>
          </div>
        }
        className="bg-gradient-to-br from-white to-purple-50 border border-purple-200 shadow-md rounded-xl"
      >
        {existingEntryForDate && (
          <Alert
            message={`Sửa nhật ký ngày ${dayjs(selectedDate).format(
              "DD/MM/YYYY"
            )}`}
            description={`Đã có nhật ký cho ngày này (${
              existingEntryForDate.cigarettes_smoked || 0
            } điếu). Bạn đang chỉnh sửa nhật ký hiện có thay vì tạo mới.`}
            type="warning"
            showIcon
            className="mb-6"
          />
        )}

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item label="Ngày">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={dayjs().format("YYYY-MM-DD")}
                className="w-full px-3 py-2 border border-purple-200 rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="cigarettes"
              label="Số điếu thuốc đã hút"
              rules={[
                { required: true, message: "Vui lòng nhập số điếu thuốc" },
                {
                  type: "number",
                  min: 0,
                  max: smokingStatus?.cigarettesPerDay || 100,
                  message: `Tối đa ${
                    smokingStatus?.cigarettesPerDay || 100
                  } điếu`,
                },
              ]}
              initialValue={0}
            >
              <InputNumber
                min={0}
                max={smokingStatus?.cigarettesPerDay || 100}
                placeholder="Ví dụ: 5"
                className="w-full"
              />
            </Form.Item>
          </div>

          <Form.Item name="symptoms" label="Triệu chứng sức khỏe">
            <TextArea
              rows={4}
              placeholder="Mô tả cảm giác, triệu chứng..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              icon={<PlusOutlined />}
              size="large"
              className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-blue-600"
            >
              {existingEntryForDate ? "Cập nhật nhật ký" : "Ghi nhật ký"}
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Thống kê */}
      {entries.length > 0 && smokingStatus && (
        <Card
          title={
            <div className="flex items-center">
              <TrendingDown className="text-2xl text-green-600 mr-3" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-700 via-blue-700 to-cyan-700 bg-clip-text text-transparent">
                Thống Kê Tiết Kiệm Chi Tiết
              </h2>
            </div>
          }
          className="bg-gradient-to-br from-white to-green-50 border border-green-200 text-green-900"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Stat
              label="Số ngày đã ghi nhật ký"
              value={groupedEntries.length}
            />
            <Stat
              label="Số ngày cai thuốc hoàn toàn"
              value={
                entries.filter((e) => (e.cigarettes_smoked || 0) === 0).length
              }
            />
            <Stat
              label="Tổng tiền tiết kiệm"
              value={entries
                .reduce(
                  (sum, e) =>
                    sum +
                    calculateMoneySaved(
                      smokingStatus,
                      e.cigarettes_smoked || 0
                    ),
                  0
                )
                .toLocaleString("vi-VN")}
              unit="VND"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Stat
              label="Tổng điếu đã hút"
              value={entries.reduce(
                (sum, e) => sum + (e.cigarettes_smoked || 0),
                0
              )}
            />
            <Stat
              label="Chuỗi ngày không hút hiện tại"
              value={calculateSmokeFreeStreak(entries)}
            />
          </div>
        </Card>
      )}

      {/* Lịch sử */}
      <Card
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CalendarOutlined className="text-2xl text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-blue-700 to-cyan-700 bg-clip-text text-transparent">
                Lịch Sử Nhật Ký
              </h2>
            </div>
            <Badge count={groupedEntries.length} showZero />
          </div>
        }
        className="bg-gradient-to-br from-white to-purple-50 border border-purple-200"
      >
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spin size="large" />
            </div>
          ) : groupedEntries.length === 0 ? (
            <Empty description="Chưa có nhật ký nào" className="py-12" />
          ) : (
            <List
              dataSource={groupedEntries}
              renderItem={([date, entriesForDate]) => {
                const latestEntry = entriesForDate[entriesForDate.length - 1];
                return (
                  <List.Item className="px-0 py-4 border-b border-purple-100 last:border-0">
                    <Card className="bg-gradient-to-r from-white to-purple-50 border border-purple-200">
                      <div>
                        <h3 className="text-lg font-semibold text-purple-800 flex items-center mb-3">
                          <CalendarOutlined className="mr-2" />
                          {dayjs(date).format("DD/MM/YYYY")} -{" "}
                          {dayjs(date).format("dddd")}
                        </h3>

                        <div className="p-3 bg-white rounded-lg border border-purple-100">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <p className="flex items-center">
                              <Cigarette className="inline w-4 h-4 mr-2 text-red-500" />
                              <span className="font-medium">Số điếu: </span>{" "}
                              {latestEntry.cigarettes_smoked || 0}
                            </p>
                            {latestEntry.health_status && (
                              <p className="flex items-center">
                                <Heart className="inline w-4 h-4 mr-2 text-pink-500" />
                                <span className="font-medium">
                                  Triệu chứng:
                                </span>{" "}
                                {latestEntry.health_status}
                              </p>
                            )}
                            <p className="flex items-center">
                              <TrendingDown className="inline w-4 h-4 mr-2 text-green-500" />
                              <span className="font-medium">Tiết kiệm:</span>{" "}
                              <span className="font-semibold text-green-600 ml-1">
                                {(
                                  latestEntry.money_saved ||
                                  calculateMoneySaved(
                                    smokingStatus,
                                    latestEntry.cigarettes_smoked || 0
                                  )
                                ).toLocaleString("vi-VN")}{" "}
                                VND
                              </span>
                            </p>
                          </div>
                          {latestEntry.time && (
                            <p className="text-sm text-gray-500 mt-2">
                              Ghi lúc: {latestEntry.time}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </List.Item>
                );
              }}
            />
          )}
        </div>
      </Card>
    </div>
  );
}

const Stat = ({ label, value, unit = "" }) => (
  <div className="text-center p-4 bg-gray-50 rounded-xl border">
    <h4 className="text-gray-800 font-medium mb-2">{label}</h4>
    <p className="text-2xl font-bold text-gray-600">
      {value} {unit}
    </p>
  </div>
);

export default JournalSection;
