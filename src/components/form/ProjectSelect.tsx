import { useEffect, useMemo, useState } from 'react';
import type { StylesConfig } from 'react-select';
import Select from 'react-select';
import type {
  ProjectCategoryResponse,
  ProjectPolicyOption,
} from '../../domains/customer/entities';
import { HttpUtil } from '../../utils/http-util';
import { ROUTE_API } from '../../utils/route-util';
const fetchProject = async () =>
  HttpUtil.get<ProjectCategoryResponse>(ROUTE_API.operationCustomerProduct);
export interface ProjectSelectOption {
  label: string;
  value: string;
  _raw?: ProjectPolicyOption;
}
interface ProjectSelectProps {
  value?: ProjectSelectOption[] | null;
  onChange?: (value: ProjectSelectOption[]) => void;
  placeholder?: string;
  isMulti?: boolean;
  closeMenuOnSelect?: boolean;
  styles?: StylesConfig<ProjectSelectOption, boolean>;
}
export default function ProjectSelect({
  value,
  onChange,
  placeholder = 'Select project...',
  isMulti = true,
  closeMenuOnSelect = false,
  styles,
}: ProjectSelectProps) {
  const [options, setOptions] = useState<ProjectSelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await fetchProject();
        const payload = res?.data?.category ?? [];
        const mapped = payload.map((item) => ({
          label: item?.label ?? String(item?.value ?? ''),
          value: item?.value ?? item?.label ?? '',
          _raw: item,
        }));
        if (mounted) setOptions(mapped);
      } catch (e) {
        console.error('[ProjectSelect] load error:', e);
        if (mounted) {
          setLoadError(
            e instanceof Error ? e.message : 'Failed to load projects'
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  const noOptionsMessage = useMemo(
    () => () =>
      loading ? 'Loading...' : loadError ? 'Failed to load' : 'No projects',
    [loading, loadError]
  );
  return (
    <Select
      value={value}
      onChange={(selected) => onChange?.(selected as ProjectSelectOption[])}
      options={options}
      isMulti={isMulti}
      placeholder={placeholder}
      closeMenuOnSelect={closeMenuOnSelect}
      isLoading={loading}
      isDisabled={loading}
      styles={styles}
      getOptionLabel={(opt) => opt.label}
      getOptionValue={(opt) => String(opt.value)}
      noOptionsMessage={noOptionsMessage}
    />
  );
}
