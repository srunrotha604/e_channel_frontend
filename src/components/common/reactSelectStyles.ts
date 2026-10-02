import type { StylesConfig } from 'react-select';
export const selectCustomStyles: StylesConfig<any, boolean> = {
  control: (provided) => ({
    ...provided,
    background: '#fff',
    boxShadow: undefined,
    cursor: 'pointer',
  }),
  container: (provided) => ({
    ...provided,
    width: '100%',
  }),
  valueContainer: (provided) => ({
    ...provided,
    whiteSpace: 'nowrap',
    flexWrap: 'nowrap',
    maxWidth: '90%',
    overflow: 'hidden',
  }),
  menu: (base) => {
    const { width, ...css } = base;
    return { ...css, minWidth: width || '300px' };
  },
};
