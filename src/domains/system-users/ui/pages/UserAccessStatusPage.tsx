import { useRequest } from 'ahooks';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import type { SelectOption } from '../../../../@type/report';
import { handleRequestStatusError } from '../../../../utils/handleRequestStatusError';
import { ROUTE_PATH } from '../../../../utils/route-util';
import {
  fetchUserAccessDetail,
  saveUserAccessStatus,
} from '../../interface-adapters';
import {
  buildUserAccessStatusDto,
  parseCsvList,
  validateRequiredFields,
} from '../../use-cases';
const UserAccessStatusPage = () => {
  document.title = 'E-CHANNEL PORTAL | user access status';
  const navigate = useNavigate();
  const params = useParams<{ userCode: string }>();
  const [value, setValue] = useState('');
  const [admin, setAdmin] = useState('');
  const [optionsAccess, setOptionsAccess] = useState<SelectOption[]>([]);
  const [selectedAccessValue, setSelectedAccessValue] = useState<string[]>([]);
  const [optionsProcess, setOptionsProcess] = useState<SelectOption[]>([]);
  const [selectedProcessValue, setSelectedProcessValue] = useState<string[]>(
    []
  );
  const { refresh: refreshDetail } = useRequest(
    () => fetchUserAccessDetail(params.userCode ?? ''),
    {
      onSuccess: (res) => {
        setValue(res?.data?.role?.[0]?.value ?? '');
        setOptionsAccess(res?.data?.access ?? []);
        setOptionsProcess(res?.data?.access ?? []);
        setAdmin(res?.data?.role?.[0]?.keyCode ?? '');
        setSelectedAccessValue(parseCsvList(res?.data?.role?.[0]?.label ?? ''));
        setSelectedProcessValue(
          parseCsvList(res?.data?.role?.[0]?.labelSecond ?? '')
        );
      },
      onError: (error) => handleRequestStatusError(error, navigate),
    }
  );

  const { run: runSaveUserAccessStatus, loading: saveLoading } = useRequest(
    saveUserAccessStatus,
    {
      manual: true,
      onSuccess: (res) => {
        toast.success(res?.data?.message);
        refreshDetail();
      },
      onError: (error) => handleRequestStatusError(error, navigate),
    }
  );

  const funcButtonHandleClickExecute = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (validateRequiredFields([selectedAccessValue])) {
      runSaveUserAccessStatus(
        buildUserAccessStatusDto(
          value,
          selectedAccessValue,
          selectedProcessValue,
          admin
        )
      );
    }
    e.preventDefault();
  };

  const goBackHandleClick = () => {
    navigate(ROUTE_PATH.user);
  };

  const accessHandleChange = (e: readonly SelectOption[] | null) => {
    setSelectedAccessValue(Array.isArray(e) ? e.map((x) => x.value) : []);
  };

  const processHandleChange = (e: readonly SelectOption[] | null) => {
    setSelectedProcessValue(Array.isArray(e) ? e.map((x) => x.value) : []);
  };

  return (
    <React.Fragment>
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="page-title">User transaction</h2>
              </div>
              <div className="col-auto ms-auto d-print-none">
                <div className="btn-list">
                  <>
                    <button
                      className="btn btn-primary d-none d-sm-inline-block"
                      onClick={goBackHandleClick}
                    >
                      <svg
                        className="icon"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1" />
                      </svg>
                      Back
                    </button>
                    <button
                      className="btn btn-primary d-sm-none btn-icon"
                      onClick={goBackHandleClick}
                    >
                      <svg
                        className="icon"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1" />
                      </svg>
                    </button>
                  </>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="page-body">
          <div className="container-xl">
            <div className="card">
              <div className="card-body">
                <div className="col-md-12">
                  <div className="mb-3">
                    <div className="form-label">Access transaction</div>
                    <Select
                      placeholder="Select Option"
                      value={optionsAccess.filter((obj) =>
                        selectedAccessValue.includes(obj.value)
                      )}
                      options={optionsAccess}
                      onChange={accessHandleChange}
                      isMulti
                      isClearable
                      closeMenuOnSelect={false}
                    />
                  </div>
                  <div className="mb-3">
                    <div className="form-label">Process transaction</div>
                    <Select
                      placeholder="Select Option"
                      value={optionsProcess.filter((obj) =>
                        selectedProcessValue.includes(obj.value)
                      )}
                      options={optionsProcess}
                      onChange={processHandleChange}
                      isMulti
                      isClearable
                      closeMenuOnSelect={false}
                    />
                  </div>
                  <div className="mb-6">
                    <label className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={admin === 'true'}
                        onChange={(e) => {
                          setAdmin(e.target.checked.toString());
                        }}
                      />
                      <span className="form-check-label">Admin branch</span>
                    </label>
                  </div>
                  <div className="form-footer">
                    <button
                      className="btn btn-primary"
                      onClick={funcButtonHandleClickExecute}
                      disabled={saveLoading}
                    >
                      {saveLoading && (
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />
                      )}
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default UserAccessStatusPage;
