import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import type {
  DuplicateCheckIdentifiers,
  DuplicateCustomerResult,
} from '../../use-cases/check-duplicate-customer';
import { fetchCustomerDuplicateCheck } from '../api/customer-transaction.api';
export const useCustomerDuplicateCheck = (
  getIdentifiers: () => DuplicateCheckIdentifiers
) => {
  const [duplicateCustomer, setDuplicateCustomer] =
    useState<DuplicateCustomerResult | null>(null);
  const checkDuplicateCustomer = async (_search?: string) => {
    console.log(_search);
    try {
      const result = await fetchCustomerDuplicateCheck(getIdentifiers());
      setDuplicateCustomer(result);
    } catch (error) {
      console.log(error);
    }
  };
  const debouncedCheckDuplicateCustomer = useDebouncedCallback(
    checkDuplicateCustomer,
    400
  );
  return {
    duplicateCustomer,
    checkDuplicateCustomer: debouncedCheckDuplicateCustomer,
  };
};
