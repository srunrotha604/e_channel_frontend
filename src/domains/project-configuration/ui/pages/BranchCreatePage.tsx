import { useRequest } from 'ahooks';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTE_PATH } from '../../../../utils/route-util';
import { handleRequestStatusError } from '../../../../utils/handleRequestStatusError';
import { createBranch } from '../../interface-adapters';
import { buildBranchCreateDto, validateRequiredFields } from '../../use-cases';
const BranchCreatePage = () => {
  document.title = 'E-CHANNEL PORTAL | branch | create';
  const navigate = useNavigate();
  const [branchCode, setBranchCode] = useState('');
  const [branchName, setBranchName] = useState('');
  const [constacts, setContacts] = useState('');
  const [phone, setPhone] = useState('');
  const [mobileOne, setMobileOne] = useState('');
  const [mobileTwo, setMobileTwo] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const params = useParams<{ key: string }>();
  const { run: runCreateBranch, loading: createLoading } = useRequest(
    createBranch,
    {
      manual: true,
      onSuccess: () => {
        navigate(`${ROUTE_PATH.branch}/${params.key}`);
      },
      onError: (error) => handleRequestStatusError(error, navigate),
    }
  );
  const funcButtonHandleClickExecute = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (validateRequiredFields([branchCode, branchName])) {
      runCreateBranch(
        buildBranchCreateDto({
          branchCode,
          branchName,
          contacts: constacts,
          phone,
          mobileOne,
          mobileTwo,
          email,
          website,
          address,
        })
      );
    }
    e.preventDefault();
  };
  const branchCodeHandleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBranchCode(event.target.value);
  };
  const branchNameHandleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBranchName(event.target.value);
  };
  const contactsHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContacts(event.target.value);
  };
  const phoneHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value);
  };
  const mobileOneHandleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMobileOne(event.target.value);
  };
  const mobileTwoHandleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMobileTwo(event.target.value);
  };
  const emailHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const websiteHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWebsite(event.target.value);
  };
  const addressHandleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setAddress(event.target.value);
  };
  const goBackHandleClick = () => {
    navigate(ROUTE_PATH.branch);
  };
  return (
    <React.Fragment>
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="page-title">Branch create</h2>
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
                    <label className="form-label required">Branch code</label>
                    <div>
                      <input
                        type="text"
                        className={
                          branchCode !== ''
                            ? 'form-control'
                            : 'form-control is-invalid is-invalid-lite'
                        }
                        placeholder="Branch code"
                        onChange={branchCodeHandleChange}
                        value={branchCode}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group mb-3 ">
                    <label className="form-label required">Branch name</label>
                    <div>
                      <input
                        type="text"
                        className={
                          branchName !== ''
                            ? 'form-control'
                            : 'form-control is-invalid is-invalid-lite'
                        }
                        placeholder="Branch name"
                        onChange={branchNameHandleChange}
                        value={branchName}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group mb-3 ">
                    <label className="form-label">Contact Name</label>
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contact Name"
                        onChange={contactsHandleChange}
                        value={constacts}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group mb-3 ">
                    <label className="form-label">Office Tel</label>
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Office Tel"
                        onChange={phoneHandleChange}
                        value={phone}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group mb-3 ">
                    <label className="form-label">Contact Person Tel 1</label>
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contact Person Tel 1"
                        onChange={mobileOneHandleChange}
                        value={mobileOne}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group mb-3 ">
                    <label className="form-label">Contact Person Tel 2</label>
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contact Person Tel 2"
                        onChange={mobileTwoHandleChange}
                        value={mobileTwo}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group mb-3 ">
                    <label className="form-label">Email</label>
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Email"
                        onChange={emailHandleChange}
                        value={email}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group mb-3 ">
                    <label className="form-label">Website</label>
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Website"
                        onChange={websiteHandleChange}
                        value={website}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group mb-3 ">
                    <label className="form-label">Address</label>
                    <div>
                      <textarea
                        className="form-control"
                        placeholder="Address ..."
                        rows={8}
                        onChange={addressHandleChange}
                        value={address}
                      />
                    </div>
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

export default BranchCreatePage;
