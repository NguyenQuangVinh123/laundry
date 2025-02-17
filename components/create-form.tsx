"use client";

import { saveContact, updateContact } from "@/lib/actions";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/buttons";
import CreatableSelect from "react-select/creatable";
import { useEffect, useState } from "react";
const CreateForm = ({ customers, bill }: { customers: any; bill: any }) => {
  const action = bill ? updateContact : saveContact;
  const [state, formAction] = useFormState(action, bill);
  const mappingCustomer = customers.map((i: any) => ({
    value: i.id,
    label: i.name,
  }));
  const [form, setForm] = useState({
    customerId: "",
    amount: "",
  });
  useEffect(() => {
    if (bill) {
      setForm({
        customerId: bill.customerId,
        amount: bill.amount,
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
  const handleSelectChange = (e: any) => {
    const { value } = e;
    setForm((prevForm) => ({
      ...prevForm,
      customerId: value,
    }));
  };
  const isFormValid = () => {
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
            name="customerId"
            isClearable={true}
            className="mt-1 text-sm border rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
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
        <input
          type="number"
          name="amount"
          id="amount"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition-all duration-300 ease-in-out"
          placeholder="Amount"
          onChange={handleInputChange}
          value={state && state.amount}
        />
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
          value={state && state.note}
        />
      </div>
  
      <SubmitButton
          label={bill ? "edit" : "save"}
          disabled={!isFormValid()}
        />
    </form>
  </div>
  
  );
};

export default CreateForm;
