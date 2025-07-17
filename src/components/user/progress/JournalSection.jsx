import React, { useState, useEffect, useMemo } from "react";
import { Form, message } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import JournalForm from "./JournalForm";
import JournalStats from "./JournalStats";
import JournalHistory from "./JournalHistory";

dayjs.extend(utc);

function calculateMoneySaved(smokingStatus, cigarettesSmoked) {
  if (!smokingStatus || smokingStatus.cigarettesPerDay <= 0) return 0;
  const { cigarettesPerDay, costPerPack, cigarettesPerPack } = smokingStatus;
  const reduction = Math.max(0, cigarettesPerDay - cigarettesSmoked);
  const costPerCigarette = costPerPack / cigarettesPerPack;
  return Math.round(reduction * costPerCigarette);
}

const JournalSection = ({
  entries = [],
  onSubmit,
  isLoading = false,
  currentStage,
  smokingStatus,
  planTotalStats = null,
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  const entriesForDate = useMemo(() => {
    return entries.filter(
      (entry) => dayjs.utc(entry.date).format("YYYY-MM-DD") === selectedDate
    );
  }, [entries, selectedDate]);

  const existingEntryForDate = entriesForDate[0] || null;

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
        date: selectedDate,
        cigarettes: cigarettesSmoked,
        symptoms: values.symptoms || "",
        time: dayjs().format("HH:mm:ss"),
        isUpdate: !!existingEntryForDate,
        entryId: existingEntryForDate?._id,
        money_saved: moneySaved,
      };

      const requestMethod = existingEntryForDate ? "PUT" : "POST";
      await onSubmit(entryData, requestMethod);

      message.success(
        existingEntryForDate
          ? "Cập nhật nhật ký thành công!"
          : "Ghi nhật ký thành công!"
      );

      setTimeout(() => {
        if (!existingEntryForDate) form.resetFields();
      }, 100);
    } catch (error) {
      message.error("Có lỗi xảy ra khi ghi nhật ký");
      console.error(error);
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
      <JournalForm
        form={form}
        handleSubmit={handleSubmit}
        submitting={submitting}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        smokingStatus={smokingStatus}
        existingEntryForDate={existingEntryForDate}
      />

      <JournalStats
        entries={entries}
        groupedEntries={groupedEntries}
        smokingStatus={smokingStatus}
        planTotalStats={planTotalStats}
      />

      <JournalHistory
        groupedEntries={groupedEntries}
        smokingStatus={smokingStatus}
        isLoading={isLoading}
      />
    </div>
  );
};

export default JournalSection;
