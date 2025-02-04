import React, { useState } from "react";

interface EditContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: FormData) => void;
  contact: {
    id: number;
    name: string;
    amount: number;
    note: string;
  };
}

const EditContactModal: React.FC<EditContactModalProps> = ({ isOpen, onClose, onSave, contact }) => {
  const [name, setName] = useState(contact.name);
  const [amount, setAmount] = useState(contact.amount.toString());
  const [note, setNote] = useState(contact.note);

  const handleSave = () => {
    const formData = new FormData();
    formData.append("customerId", contact.id.toString());
    formData.append("name", name);
    formData.append("amount", amount);
    formData.append("note", note);
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white w-full max-w-md mx-auto rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Contact</h2>

        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-4"
        />

        <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-4"
        />

        <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-4"
          rows={4}
        />

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditContactModal;