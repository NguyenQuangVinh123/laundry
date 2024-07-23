"use client";

import { saveContact } from "@/lib/actions";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/buttons";
import CreatableSelect from 'react-select/creatable';
const CreateForm = ({customers} : {customers: any}) => {
  const [state, formAction] = useFormState(saveContact, null);
  const mappingCustomer = customers.map((i: any) => ({
    value: i.id,
    label: i.name
  }))
  console.log(mappingCustomer, 'mappingCustomer')
  return (
    <div>
      <form action={formAction}>
        <div className="mb-5">
          <label
            htmlFor="customerId"
            className="block text-sm font-medium text-gray-900"
          >
            Customer Name
          </label>
          <CreatableSelect options={mappingCustomer} name="customerId" isClearable={true} />
          
        </div>
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
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Amount"
          />
          
        </div>
        
        <SubmitButton label="save" />
      </form>
    </div>
  );
};

export default CreateForm;
