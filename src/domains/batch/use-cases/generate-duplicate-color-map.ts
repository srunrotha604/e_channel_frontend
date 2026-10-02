import type { BatchCustomerRow } from '../entities';
const duplicatedColorCode = [
  '#EBB99A',
  '#CDFC92',
  '#E6A9D9',
  '#ACD8E6',
  '#E4F4A4',
  '#CFCFE0',
  '#FBD1A6',
  '#98E6D2',
  '#C096F6',
  '#B4F4C6',
  '#FFA390',
  '#AEDEF4',
  '#E9A9F1',
  '#A3F3E3',
  '#C7E19A',
  '#D9D9A2',
  '#E1A2F5',
  '#F5C5A2',
  '#B5E5E5',
  '#D3B5B5',
];
export interface DuplicateColorMap {
  nic: Map<string | undefined, string | null>;
  customerId: Map<string | undefined, string | null>;
  nicColor: number;
  customerIdColor: number;
}
export const generateDuplicateColorMap = (
  data: BatchCustomerRow[]
): DuplicateColorMap => {
  return data.reduce<DuplicateColorMap>(
    (acc, item) => {
      if (!acc.nic.has(item.nicPassport)) {
        acc.nic.set(item.nicPassport, null);
      } else if (!acc.nic.get(item.nicPassport)) {
        acc.nic.set(item.nicPassport, duplicatedColorCode[acc.nicColor]);
        if (acc.nicColor < duplicatedColorCode.length) {
          acc.nicColor += 1;
        } else {
          acc.nicColor = 0;
        }
      }

      if (!acc.customerId.has(item.customerId)) {
        acc.customerId.set(item.customerId, null);
      } else if (!acc.customerId.get(item.customerId)) {
        acc.customerId.set(
          item.customerId,
          duplicatedColorCode[acc.customerIdColor]
        );
        if (acc.customerIdColor < duplicatedColorCode.length) {
          acc.customerIdColor += 1;
        } else {
          acc.customerIdColor = 0;
        }
      }

      return acc;
    },
    { nic: new Map(), customerId: new Map(), nicColor: 1, customerIdColor: 0 }
  );
};
