import { useRequest } from 'ahooks';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import type { SelectOption } from '../../../../@type/report';
import { handleRequestStatusError } from '../../../../utils/handleRequestStatusError';
import { ROUTE_PATH } from '../../../../utils/route-util';
import {
  fetchUserByCode,
  fetchUserRoleOptions,
  updateUser,
} from '../../interface-adapters';
import { buildUserEditDto, validateRequiredFields } from '../../use-cases';

const UserEditPage = () => {
  document.title = 'E-CHANNEL PORTAL | user - edit';
  const navigate = useNavigate();
  const params = useParams<{ key: string }>();
  const [textEmail, setTextEmail] = useState('');
  const [textFirstName, setTextFirstName] = useState('');
  const [textLastName, setTextLastName] = useState('');
  const [RoleCategory, setOptionBranch] = useState<SelectOption[]>([]);
  const [selectedRole, setSelectedRole] = useState('');
  useRequest(() => fetchUserByCode(params.key ?? ''), {
    onSuccess: (res) => {
      const dataList = res?.data?.list?.[0];
      setTextEmail(dataList?.email ?? '');
      setTextFirstName(dataList?.givenName ?? '');
      setTextLastName(dataList?.sureName ?? '');
    },
    onError: (error) => handleRequestStatusError(error, navigate),
  });

  useRequest(fetchUserRoleOptions, {
    onSuccess: (res) => {
      setOptionBranch(res?.data?.role ?? []);
    },
    onError: (error) => handleRequestStatusError(error, navigate),
  });

  const { run: runUpdateUser, loading: updateLoading } = useRequest(
    updateUser,
    {
      manual: true,
      onSuccess: (res) => {
        toast.success(res?.data?.message);
        navigate(ROUTE_PATH.user);
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
        selectedRole,
      ])
    ) {
      runUpdateUser(buildUserEditDto(params.key, selectedRole));
    }
    e.preventDefault();
  };

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

  const roleHandleChange = (e: SelectOption | null) => {
    setSelectedRole(e?.value ?? '');
  };
  return (
    <React.Fragment>
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="page-title">User #edit</h2>
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
                        readOnly
                        required
                      />
                    </div>
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
                        readOnly
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
                        readOnly
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label required">Role</label>
                    <div>
                      <Select
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        menuPortalTarget={document.body}
                        value={RoleCategory.find(function (option) {
                          return option.value === selectedRole;
                        })}
                        onChange={roleHandleChange}
                        options={RoleCategory}
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
                      disabled={updateLoading}
                    >
                      {updateLoading && (
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
export default UserEditPage;
