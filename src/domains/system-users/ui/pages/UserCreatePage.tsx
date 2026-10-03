import { useRequest } from 'ahooks';
import React, { useEffect, useState } from 'react';
import { PatternFormat } from 'react-number-format';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import type { SelectOption } from '../../../../@type/report';
import { useAuth } from '../../../../context/AuthContext';
import { handleRequestStatusError } from '../../../../utils/handleRequestStatusError';
import { ROUTE_PATH } from '../../../../utils/route-util';
import {
  checkBranchManagerConflict,
  createUser,
  fetchUserRoleOptions,
} from '../../interface-adapters';
import {
  buildUserCreateDto,
  deriveBranchOptions,
  validateRequiredFields,
} from '../../use-cases';

const UserCreatePage = () => {
  document.title = 'E-CHANNEL PORTAL | user - create';
  const navigate = useNavigate();
  const { company } = useAuth();
  const [textEmail, setTextEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [textFirstName, setTextFirstName] = useState('');
  const [textLastName, setTextLastName] = useState('');

  const [optionRole, setOptionRole] = useState<SelectOption[]>([]);
  const [selectedRole, setSelectedRole] = useState('');

  const [optionBranch, setOptionBranch] = useState<SelectOption[]>([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [message, setMessage] = useState('');

  useRequest(fetchUserRoleOptions, {
    onSuccess: (res) => {
      setOptionRole(res?.data?.role ?? []);
    },
    onError: (error) => handleRequestStatusError(error, navigate),
  });

  const { run: runCreateUser, loading: createLoading } = useRequest(
    createUser,
    {
      manual: true,
      onSuccess: (res) => {
        toast.success(res?.data?.message);
        navigate(ROUTE_PATH.user);
      },
      onError: (error) => handleRequestStatusError(error, navigate),
    }
  );

  const { run: runCheckBranchManagerConflict } = useRequest(
    checkBranchManagerConflict,
    {
      manual: true,
      onSuccess: (res) => {
        setMessage(res?.data?.message ?? '');
      },
      onError: (error) => handleRequestStatusError(error, navigate),
    }
  );

  const funcButtonHandleClickExecute = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (
      validateRequiredFields([
        textEmail,
        textFirstName,
        textLastName,
        selectedBranch,
        selectedRole,
      ])
    ) {
      runCreateUser(
        buildUserCreateDto({
          email: textEmail,
          givenName: textFirstName,
          sureName: textLastName,
          role: selectedRole,
          branch: selectedBranch,
          phone,
        })
      );
    }
    e.preventDefault();
  };

  useEffect(() => {
    setOptionBranch(deriveBranchOptions(company));
  }, []);

  const emailHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextEmail(event.target.value);
  };
  const firstNameHandleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTextFirstName(event.target.value);
  };
  const lastNameHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextLastName(event.target.value);
  };

  const goBackHandleClick = () => {
    navigate(ROUTE_PATH.user);
  };

  const branchHandleChange = (e: SelectOption | null) => {
    setSelectedBranch(e?.value ?? '');
    runCheckBranchManagerConflict(e?.value ?? '');
  };

  const roleHandleChange = (e: SelectOption | null) => {
    setSelectedRole(e?.value ?? '');
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="page-title">User #create new</h2>
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
                {message != '' ? (
                  <div className="alert alert-danger">
                    User <b>{message}</b> is currently the <b>Branch Manager</b>{' '}
                    for this branch. Create user with same role will result in
                    replacement.
                  </div>
                ) : (
                  ''
                )}

                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label required">Email</label>
                    <div>
                      <input
                        type="email"
                        className={
                          textEmail !== ''
                            ? 'form-control'
                            : 'form-control is-invalid is-invalid-lite'
                        }
                        placeholder="Email"
                        onChange={emailHandleChange}
                        value={textEmail}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">Phone number</label>
                    <PatternFormat
                      type="text"
                      className="form-control"
                      placeholder="### ## ## ## #"
                      onChange={(e) => setPhone(e?.target?.value)}
                      value={phone}
                      required
                      max={10}
                      format="### ## ## ## #"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label required">First name</label>
                    <div>
                      <input
                        type="text"
                        className={
                          textFirstName !== ''
                            ? 'form-control'
                            : 'form-control is-invalid is-invalid-lite'
                        }
                        placeholder="First name"
                        onChange={firstNameHandleChange}
                        value={textFirstName}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label required">Last name</label>
                    <div>
                      <input
                        type="text"
                        className={
                          textLastName !== ''
                            ? 'form-control'
                            : 'form-control is-invalid is-invalid-lite'
                        }
                        placeholder="Last name"
                        onChange={lastNameHandleChange}
                        value={textLastName}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label required">Branch</label>
                    <div>
                      <Select
                        value={optionBranch?.filter(function (option) {
                          return option.value === selectedBranch;
                        })}
                        onChange={branchHandleChange}
                        options={optionBranch}
                        required
                      />
                      <div className="invalid-feedback">
                        Please select Role!
                      </div>
                    </div>
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label required">Role</label>
                    <div>
                      <Select
                        value={optionRole?.filter(function (option) {
                          return option?.value === selectedRole;
                        })}
                        onChange={roleHandleChange}
                        options={optionRole}
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
    </>
  );
};

export default UserCreatePage;
