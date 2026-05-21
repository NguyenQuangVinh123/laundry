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

const CreateForm = ({ customers, bill }: { customers: any; bill: any }) => {
  const action = bill ? updateContact : saveContact;
  const [state, formAction] = useFormState(action, null);
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
        customerId: String(bill.customerId ?? ""),
        amount: bill.amount != null ? String(bill.amount) : "",
        note: bill.note ?? "",
      });
    }
  }, [bill]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (
    option: { value: number | string; label: string } | null
  ) => {
    if (!option) {
      setForm((prev) => ({ ...prev, customerId: "" }));
      return;
    }
    setForm((prev) => ({
      ...prev,
      customerId: String(option.value),
    }));
  };

  const isFormValid = () => {
    const amount = Number(form.amount);
    return form.customerId !== "" && !Number.isNaN(amount) && amount > 0;
  };

  return (
    <div>
      <form action={formAction}>
        <div className="hidden">
          <input type="number" name="id" id="id" value={bill?.id ?? ""} readOnly />
        </div>

        {!bill && (
          <div className="mb-5">
            <label
              htmlFor="customerId"
              className="block text-sm font-medium text-gray-900"
            >
              Tên khách hàng
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
            <input type="hidden" name="customerId" value={form.customerId} />
          </div>
        )}

        <div className="mb-5">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-900"
          >
            Số tiền
          </label>
          <input
            type="number"
            name="amount"
            id="amount"
            min={1}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition-all duration-300 ease-in-out"
            placeholder="Số tiền"
            onChange={handleInputChange}
            value={form.amount}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="note"
            className="block text-sm font-medium text-gray-900"
          >
            Ghi chú
          </label>
          <input
            type="text"
            name="note"
            id="note"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition-all duration-300 ease-in-out"
            placeholder="Ghi chú"
            onChange={handleInputChange}
            value={form.note}
          />
        </div>

        {state?.message && (
          <p className="mb-4 text-sm text-red-600">{state.message}</p>
        )}

        <SubmitButton
          label={bill ? "edit" : "save"}
          disabled={!isFormValid()}
        />
      </form>
    </div>
  );
};

export default CreateForm;
