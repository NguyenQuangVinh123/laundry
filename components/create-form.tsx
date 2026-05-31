"use client";

import { saveContact, updateContact } from "@/lib/actions";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/buttons";
import CreatableSelect from "react-select/creatable";
import { useEffect, useMemo, useState } from "react";
import { normalizeForSearch } from "@/lib/utils";

type CustomerOption = { value: number; label: string };

const filterCustomerOption = (
  option: { label: string; value: number | string },
  inputValue: string
) => {
  if (!inputValue.trim()) return true;
  return normalizeForSearch(option.label).includes(
    normalizeForSearch(inputValue)
  );
};

const CreateForm = ({
  customers,
  bill,
  noteOnly = false,
}: {
  customers: any;
  bill: any;
  noteOnly?: boolean;
}) => {
  const action = bill ? updateContact : saveContact;
  const [state, formAction] = useFormState(action, bill);
  const mappingCustomer = useMemo<CustomerOption[]>(
    () =>
      customers
        .map((i: { id: number; name: string }) => ({
          value: i.id,
          label: i.name,
        }))
        .sort((a: CustomerOption, b: CustomerOption) =>
          a.label.localeCompare(b.label, "vi")
        ),
    [customers]
  );
  const [form, setForm] = useState({
    customerId: "",
    amount: "",
    note: "",
  });
  useEffect(() => {
    if (bill) {
      setForm({
        customerId: String(bill.customerId),
        amount: String(bill.amount),
        note: bill.note ?? "",
      });
    }
  }, [bill]);
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    if (state) {
      state[name] = value;
    }
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };
  const handleSelectChange = (e: { value: number | string; label: string } | null) => {
    if (!e) {
      setForm((prev) => ({ ...prev, customerId: "" }));
      return;
    }
    setForm((prevForm) => ({
      ...prevForm,
      customerId: String(e.value),
    }));
  };
  const isFormValid = () => {
    if (noteOnly) return Boolean(bill?.id);
    return form.customerId !== "" && form.amount !== "";
  };
  return (
    <div>
    <form action={formAction}>
      <div className="hidden">
        <input type="number" name="id" id="id" value={bill && bill.id} />
      </div>
  
      {!state && (
        <div className="mb-5">
          <label
            htmlFor="customerId"
            className="block text-sm font-medium text-gray-900"
          >
            Customer Name
          </label>
          <CreatableSelect
            onChange={handleSelectChange}
            options={mappingCustomer}
            isClearable
            placeholder="Gõ tên khách để tìm…"
            noOptionsMessage={() => "Không thấy — Enter để tạo khách mới"}
            formatCreateLabel={(input) => `Tạo khách: "${input}"`}
            filterOption={filterCustomerOption}
            className="mt-1 text-sm border rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
            classNamePrefix="customer-select"
          />
          <input
            type="hidden"
            name="customerId"
            value={form.customerId}
          />
        </div>
      )}
  
      <div className="mb-5">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-900"
        >
          Amount
        </label>
        {noteOnly ? (
          <>
            <input
              type="text"
              readOnly
              className="bg-gray-100 border border-gray-200 text-gray-700 text-sm rounded-md block w-full p-3 cursor-not-allowed"
              value={Number(form.amount || 0).toLocaleString("en-US")}
            />
            <input type="hidden" name="amount" value={bill?.amount ?? ""} />
          </>
        ) : (
          <input
            type="number"
            name="amount"
            id="amount"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition-all duration-300 ease-in-out"
            placeholder="Amount"
            onChange={handleInputChange}
            value={form.amount}
          />
        )}
      </div>
  
      <div className="mb-5">
        <label
          htmlFor="note"
          className="block text-sm font-medium text-gray-900"
        >
          Note
        </label>
        <input
          type="text"
          name="note"
          id="note"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition-all duration-300 ease-in-out"
          placeholder="Note"
          onChange={handleInputChange}
          value={form.note}
        />
      </div>
  
      <SubmitButton
          label={bill ? (noteOnly ? "Lưu ghi chú" : "edit") : "save"}
          disabled={!isFormValid()}
        />
    </form>
  </div>
  
  );
};

export default CreateForm;
