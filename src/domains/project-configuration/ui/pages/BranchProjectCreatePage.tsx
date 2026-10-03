import { useRequest } from 'ahooks';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select, { MultiValue, SingleValue } from 'react-select';
import type { SelectOption } from '../../../../@type/report';
import { handleRequestStatusError } from '../../../../utils/handleRequestStatusError';
import { ROUTE_PATH } from '../../../../utils/route-util';
import type { BranchProjectOption } from '../../entities';
import {
  createBranchProject,
  fetchBranchProjectOptions,
} from '../../interface-adapters';
import {
  buildBranchProjectCreateDto,
  filterPoliciesByProjectKey,
  validateRequiredFields,
} from '../../use-cases';
const BranchProjectCreatePage = () => {
  document.title = 'E-CHANNEL PORTAL | project | import';
  const navigate = useNavigate();
  const params = useParams<{ key: string }>();
  const [optionProject, setOptionProject] = useState<BranchProjectOption[]>([]);
  const [selectedProject, setSelectdProject] = useState('');
  const [optionPolicies, setOptionPolicies] = useState<SelectOption[]>([]);
  const [selectedPolicies, setSelectdPolicies] = useState<string[]>([]);
  useRequest(() => fetchBranchProjectOptions(params.key ?? ''), {
    onSuccess: (res) => {
      setOptionProject(res?.data?.options ?? []);
    },
    onError: (error) => handleRequestStatusError(error, navigate),
  });
  const { run: runCreateBranchProject, loading: createLoading } = useRequest(
    createBranchProject,
    {
      manual: true,
      onSuccess: () => {
        navigate(ROUTE_PATH.branchProject(params.key ?? ''));
      },
      onError: (error) => handleRequestStatusError(error, navigate),
    }
  );
  const funcButtonHandleClickExecute = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (validateRequiredFields([selectedProject, selectedPolicies])) {
      runCreateBranchProject(
        buildBranchProjectCreateDto(
          params.key,
          selectedProject,
          selectedPolicies
        )
      );
    }
    e.preventDefault();
  };
  const projectHandleChange = (value: SingleValue<BranchProjectOption>) => {
    setSelectdProject(value?.value ?? '');
    setOptionPolicies(
      filterPoliciesByProjectKey(optionProject, value?.value ?? '')
    );
  };
  const PoliciesHandleChange = (value: MultiValue<SelectOption> | null) => {
    setSelectdPolicies(Array.isArray(value) ? value.map((x) => x.value) : []);
  };
  const goBackHandleClick = () => {
    navigate(ROUTE_PATH.branchProject(params.key ?? ''));
  };
  return (
    <React.Fragment>
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="page-title">Project import</h2>
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
                <div className="col-md-12">
                  <div className="form-group mb-3">
                    <label className="form-label required">Project name</label>
                    <Select
                      value={optionProject?.filter(function (option) {
                        return option.value === selectedProject;
                      })}
                      onChange={projectHandleChange}
                      options={optionProject}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label required">Policies</label>
                    <Select
                      placeholder="Select Option"
                      value={optionPolicies.filter((obj) =>
                        selectedPolicies.includes(obj.value)
                      )}
                      options={optionPolicies}
                      onChange={PoliciesHandleChange}
                      isMulti
                      isClearable
                      closeMenuOnSelect={false}
                    />
                  </div>

                  <div className="form-footer">
                    <button
                      className="btn btn-primary"
                      onClick={funcButtonHandleClickExecute}
                      disabled={createLoading}
                    >
                      {createLoading ? (
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-tabler icon-tabler-check"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M5 12l5 5l10 -10" />
                        </svg>
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

export default BranchProjectCreatePage;
