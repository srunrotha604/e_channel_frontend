import { format, isValid, parse } from 'date-fns';
import type { ChangeEvent, KeyboardEvent } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { DateRange, type RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import '../../assets/style/custom_style.css';
interface DateRangeValue {
  startDate: Date | null;
  endDate: Date | null;
}
interface DateRangeSelectorProps {
  date?: DateRangeValue;
  onDateChange?: (value: DateRangeValue) => void;
  placeholder?: string;
}
export default function DateRangeSelector({
  date,
  onDateChange,
  placeholder,
}: DateRangeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [committed, setCommitted] = useState<DateRangeValue>({
    startDate: date?.startDate ?? null,
    endDate: date?.endDate ?? null,
  });
  const [draftRange, setDraftRange] = useState([
    {
      startDate: date?.startDate ?? new Date(),
      endDate: date?.endDate ?? new Date(),
      key: 'selection',
    },
  ]);
  const [textValue, setTextValue] = useState('');
  const [hasDraftChanged, setHasDraftChanged] = useState(false);
  useEffect(() => {
    const startDate = date?.startDate ?? null;
    const endDate = date?.endDate ?? null;
    setCommitted({ startDate, endDate });
    setDraftRange([
      {
        startDate: startDate ?? new Date(),
        endDate: endDate ?? new Date(),
        key: 'selection',
      },
    ]);
    if (startDate && endDate) {
      setTextValue(
        `${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`
      );
    } else {
      setTextValue('');
    }
  }, [date?.startDate, date?.endDate]);
  const ref = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedInsideWrapper = ref.current?.contains(target);
      const clickedInsidePopup = popupRef.current?.contains(target);
      if (clickedInsideWrapper || clickedInsidePopup) return;

      setOpen(false);

      if (hasDraftChanged) {
        apply();
        return;
      }

      setDraftRange([
        {
          startDate: committed.startDate ?? new Date(),
          endDate: committed.endDate ?? new Date(),
          key: 'selection',
        },
      ]);

      if (committed.startDate && committed.endDate) {
        setTextValue(
          `${format(committed.startDate, 'dd/MM/yyyy')} - ${format(
            committed.endDate,
            'dd/MM/yyyy'
          )}`
        );
      } else {
        setTextValue('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [committed, hasDraftChanged]);
  const onPickerChange = (item: RangeKeyDict) => {
    const { startDate, endDate } = item.selection;
    setDraftRange([item.selection as (typeof draftRange)[number]]);
    onDateChange?.({ startDate: startDate || null, endDate: endDate || null });
    setHasDraftChanged(true);
    if (startDate && endDate) {
      setTextValue(
        `${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`
      );
    }
  };
  const apply = () => {
    const { startDate, endDate } = draftRange[0];
    setCommitted({ startDate, endDate });

    if (startDate && endDate) {
      setTextValue(
        `${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`
      );
    } else {
      setTextValue('');
    }

    onDateChange?.({ startDate, endDate });
    setOpen(false);
    setHasDraftChanged(false);
  };
  const cancel = () => {
    setDraftRange([
      {
        startDate: committed.startDate ?? new Date(),
        endDate: committed.endDate ?? new Date(),
        key: 'selection',
      },
    ]);
    if (committed.startDate && committed.endDate) {
      setTextValue(
        `${format(committed.startDate, 'dd/MM/yyyy')} - ${format(
          committed.endDate,
          'dd/MM/yyyy'
        )}`
      );
    } else {
      setTextValue('');
    }
    setOpen(false);
    setHasDraftChanged(false);
  };
  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCommitted({ startDate: null, endDate: null });
    setDraftRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      },
    ]);
    setTextValue('');
    onDateChange?.({ startDate: null, endDate: null });
  };
  const applyFromInput = () => {
    const value = textValue.trim();
    if (!value) {
      setCommitted({ startDate: null, endDate: null });
      setDraftRange([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection',
        },
      ]);
      onDateChange?.({ startDate: null, endDate: null });
      return;
    }
    const parts = value.split('-');
    if (parts.length !== 2) {
      return;
    }
    const startStr = parts[0].trim();
    const endStr = parts[1].trim();
    if (!startStr || !endStr) {
      return;
    }
    const parsedStart = parse(startStr, 'dd/MM/yyyy', new Date());
    const parsedEnd = parse(endStr, 'dd/MM/yyyy', new Date());
    if (!isValid(parsedStart) || !isValid(parsedEnd)) {
      return;
    }
    const startDate = parsedStart;
    const endDate = parsedEnd;
    setCommitted({ startDate, endDate });
    setDraftRange([
      {
        startDate,
        endDate,
        key: 'selection',
      },
    ]);
    onDateChange?.({ startDate, endDate });
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.target.value);
  };
  const handleInputBlur = () => {
    applyFromInput();
  };
  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      applyFromInput();
      setOpen(false);
    }
  };
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input
          onClick={() => {
            setOpen((o) => !o);
            setDraftRange([
              {
                startDate: committed.startDate ?? new Date(),
                endDate: committed.endDate ?? new Date(),
                key: 'selection',
              },
            ]);
            setHasDraftChanged(false);
          }}
          value={textValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          className="form-control"
          style={{ padding: '9px 34px 9px 9px' }}
          placeholder={placeholder ?? 'dd/MM/yyyy - dd/MM/yyyy'}
        />
        {textValue && (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear date range"
            className="date-range-clear-btn"
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              lineHeight: 1,
              opacity: 0.2,
            }}
          >
            <svg
              height="20"
              width="20"
              viewBox="0 0 20 20"
              aria-hidden="true"
              focusable="false"
              className="css-tj5bde-Svg"
            >
              <path
                fill="currentColor"
                d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"
              ></path>
            </svg>
          </button>
        )}
      </div>
      {open && (
        <div className="custom_range_date_picker">
          <DateRange
            editableDateInputs
            dateDisplayFormat="dd/MM/yyyy"
            onChange={onPickerChange}
            moveRangeOnFirstSelection={false}
            ranges={draftRange}
            months={2}
            direction="horizontal"
            rangeColors={['#1976d2']}
          />
          <div className="d-flex justify-content-end gap-2">
            <button onClick={cancel} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={apply} className="btn btn-primary">
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
