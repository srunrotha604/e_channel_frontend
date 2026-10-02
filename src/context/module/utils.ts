import type { ModuleActionItem, ModuleGroupItem } from '../../@type/module';
const defaultAssignByCode = (
  acc: Record<string, unknown>,
  curr: { code: string }
) => {
  acc[curr.code] = curr;
};
export const arrayToObject = <T extends { code: string }, R = T>(
  array: T[] | undefined,
  callback: (acc: Record<string, R>, curr: T) => void = defaultAssignByCode as (
    acc: Record<string, R>,
    curr: T
  ) => void
): Record<string, R> => {
  return (array ?? []).reduce<Record<string, R>>((accAction, currAction) => {
    callback(accAction, currAction);
    return accAction;
  }, {});
};
export const buildModuleObject = (
  module: ModuleGroupItem[] | undefined
): Record<string, Record<string, ModuleActionItem>> => {
  return arrayToObject<ModuleGroupItem, Record<string, ModuleActionItem>>(
    module,
    (acc, curr) => {
      acc[curr.code] = arrayToObject<ModuleActionItem>(curr.action);
    }
  );
};
export const isModuleActive = (
  moduleObject:
    | Record<string, Record<string, { active?: boolean }>>
    | undefined,
  exectute: string,
  feature: string
): boolean => {
  return (
    (moduleObject?.[exectute] &&
      moduleObject?.[exectute]?.[feature] &&
      moduleObject?.[exectute]?.[feature]?.active) ||
    false
  );
};
