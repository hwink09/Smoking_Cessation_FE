import React from "react";
import { Modal, Button } from "antd";

const ShareModal = ({ badge, visible, onClose }) => {
  if (!badge) return null;

  return (
    <Modal
      title="Share Your Achievement"
      open={visible}
      onCancel={onClose}
      footer={<Button onClick={onClose}>Close</Button>}
    >
      <div>
        <p>Share your achievement with friends!</p>
        <div className="flex justify-center space-x-4 my-4">
          <Button type="primary" className="bg-blue-600">
            Facebook
          </Button>
          <Button type="primary" className="bg-sky-500">
            Twitter
          </Button>
          <Button type="primary" className="bg-green-600">
            WhatsApp
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
