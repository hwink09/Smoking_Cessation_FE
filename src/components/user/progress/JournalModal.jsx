import React from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Rate,
  Button,
} from "antd";
import dayjs from "dayjs";

const { TextArea } = Input;

function JournalModal({
  isJournalModalVisible,
  setIsJournalModalVisible,
  form,
  editingEntry,
  handleJournalSubmit,
}) {
  return (
    <Modal
      title={editingEntry ? "Edit Journal Entry" : "Add Journal Entry"}
      open={isJournalModalVisible}
      onCancel={() => setIsJournalModalVisible(false)}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleJournalSubmit}
        initialValues={{
          date: dayjs(),
          cigarettes: 0,
          mood: 5,
          cravings: 0,
          exercise: 0,
          healthStatus: "good",
        }}
      >
        <Form.Item name="date" label="Date" rules={[{ required: true }]}>
          <DatePicker className="w-full" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="cigarettes" label="Cigarettes Smoked">
            <InputNumber min={0} className="w-full" />
          </Form.Item>

          <Form.Item name="cravings" label="Craving Intensity (1-10)">
            <Rate count={10} />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="mood" label="Mood (1-10)">
            <Rate count={10} />
          </Form.Item>

          <Form.Item name="exercise" label="Exercise (minutes)">
            <InputNumber min={0} className="w-full" />
          </Form.Item>
        </div>

        <Form.Item name="healthStatus" label="Health Status">
          <Select>
            <Select.Option value="excellent">Excellent</Select.Option>
            <Select.Option value="good">Good</Select.Option>
            <Select.Option value="fair">Fair</Select.Option>
            <Select.Option value="poor">Poor</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="notes" label="Notes & Reflections">
          <TextArea
            rows={4}
            placeholder="How are you feeling today? Any challenges or victories?"
          />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setIsJournalModalVisible(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {editingEntry ? "Update Entry" : "Add Entry"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default JournalModal;
