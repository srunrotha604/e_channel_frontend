import { useRequest } from 'ahooks';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import type { SelectOption } from '../../../../@type/report';
import { handleRequestStatusError } from '../../../../utils/handleRequestStatusError';
import { ROUTE_PATH } from '../../../../utils/route-util';
import {
  createUserRole,
  fetchApplicationOptions,
  fetchSystemUserRoleOptions,
} from '../../interface-adapters';
import {
  buildUserRoleCreateDto,
  validateRequiredFields,
} from '../../use-cases';
import { customSelectStyles } from '../components/CustomSelectStyles';

const UserRoleCreatePage = () => {
  document.title = 'E-CHANNEL PORTAL | user role create';
  const navigate = useNavigate();
  const params = useParams<{ key: string }>();

  const [optionApplication, setOptionApplication] = useState<SelectOption[]>(
    []
  );
  const [optionRole, setOptionRole] = useState<SelectOption[]>([]);
  const [selectedApplication, setSelectedApplication] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  useRequest(() => fetchApplicationOptions(params.key || ''), {
    onSuccess: (res) => {
      setOptionApplication(res?.data?.application ?? []);
    },
    onError: (error) => handleRequestStatusError(error, navigate),
  });

  const { run: runCreateUserRole, loading: createLoading } = useRequest(
    createUserRole,
    {
      manual: true,
      onSuccess: (res) => {
        toast.success(res?.data?.message);
        navigate(ROUTE_PATH.userRole(params.key ?? ''));
      },
      onError: (error) => handleRequestStatusError(error, navigate),
    }
  );

  const { run: runFetchSystemUserRoleOptions } = useRequest(
    fetchSystemUserRoleOptions,
    {
      manual: true,
      onSuccess: (res) => {
        setOptionRole(res?.data?.options ?? []);
      },
      onError: (error) => handleRequestStatusError(error, navigate),
    }
  );

  const funcButtonHandleClickExecute = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (validateRequiredFields([selectedApplication, selectedRole])) {
      runCreateUserRole(
        buildUserRoleCreateDto(selectedApplication, selectedRole, params.key)
      );
    }
    e.preventDefault();
  };

  const applicationHandleChange = (e: SelectOption | null) => {
    setSelectedApplication(e?.value ?? '');
    runFetchSystemUserRoleOptions(e?.value || '');
  };

  const roleHandleChange = (e: SelectOption | null) => {
    setSelectedRole(e?.value ?? '');
  };

  const goBackHandleClick = () => {
    navigate(ROUTE_PATH.userRole(params.key ?? ''));
  };

  return (
    <React.Fragment>
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="page-title">Add role</h2>
              </div>
              <div className="col-auto ms-auto d-print-none">
                <div className="btn-list">
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
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="page-body">
          <div className="container-xl">
            <div className="card">
              <div className="card-body">
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label required">Application</label>
                    <div>
                      <Select
                        value={optionApplication.filter(function (option) {
                          return option.value === selectedApplication;
                        })}
                        onChange={applicationHandleChange}
                        options={optionApplication}
                        styles={customSelectStyles}
                        required
                      />
                      <div className="invalid-feedback">
                        Please select application!
                      </div>
                    </div>
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label required">Role</label>
                    <div>
                      <Select
                        value={optionRole.filter(function (option) {
                          return option.value === selectedRole;
                        })}
                        onChange={roleHandleChange}
                        options={optionRole}
                        styles={customSelectStyles}
                        required
                      />
                      <div className="invalid-feedback">
                        Please select Role!
                      </div>
                    </div>
                  </div>
                  <div className="form-footer">
                    <button
                      className="btn btn-primary"
                      onClick={funcButtonHandleClickExecute}
                      disabled={createLoading}
                    >
                      {createLoading && (
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

export default UserRoleCreatePage;
