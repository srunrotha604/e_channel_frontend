import React, { createContext, useContext, useMemo } from 'react';
import type {
  MenuItem,
  ModuleActionItem,
  ModuleContextValue,
  ModuleGroupItem,
} from '../../@type/module';
import { arrayToObject, buildModuleObject, isModuleActive } from './utils';
const ModuleContext = createContext<ModuleContextValue>({
  hasMainMenuPermission: () => false,
  hasMenuPermission: () => false,
  hasModulePermission: () => false,
});
interface ProccessedModule {
  mainMenu: Record<string, MenuItem>;
  menu: Record<string, MenuItem>;
  module: Record<string, Record<string, ModuleActionItem>>;
}
interface ModuleContextProviderProps {
  children?: React.ReactNode;
  mainMenu?: MenuItem[];
  menu?: MenuItem[];
  module?: ModuleGroupItem[] | null;
}
const ModuleContextProvider = ({
  children,
  mainMenu,
  menu,
  module,
}: ModuleContextProviderProps) => {
  const proccessedModule = useMemo<ProccessedModule>(() => {
    if (!module) return { mainMenu: {}, menu: {}, module: {} };
    return {
      mainMenu: arrayToObject(mainMenu),
      menu: arrayToObject(menu),
      module: buildModuleObject(module),
    };
  }, [module, mainMenu, menu]);
  const hasModulePermission = (execution: string, feature: string) => {
    return isModuleActive(proccessedModule.module, execution, feature);
  };
  const hasMenuPermission = (code: string) => {
    return (
      (proccessedModule.menu[code] && proccessedModule.menu[code]?.active) ||
      false
    );
  };
  const hasMainMenuPermission = (code: string) => {
    return (
      (proccessedModule.mainMenu[code] &&
        proccessedModule.mainMenu[code]?.active) ||
      false
    );
  };
  return (
    <ModuleContext.Provider
      value={{ hasMainMenuPermission, hasMenuPermission, hasModulePermission }}
    >
      {children}
    </ModuleContext.Provider>
  );
};
export const useModulePermission = () => useContext(ModuleContext);
export default ModuleContextProvider;
