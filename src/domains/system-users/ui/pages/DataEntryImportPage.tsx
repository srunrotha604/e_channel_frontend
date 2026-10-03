import { useRequest } from 'ahooks';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { handleRequestStatusError } from '../../../../utils/handleRequestStatusError';
import { ROUTE_PATH } from '../../../../utils/route-util';
import { importDataEntry } from '../../interface-adapters';
import {
  buildDataEntryImportDto,
  validateRequiredFields,
} from '../../use-cases';

const DataEntryImportPage = () => {
  document.title = 'E-CHANNEL PORTAL | data entry - import';
  const navigate = useNavigate();
  const [textEmail, setTextEmail] = useState('');

  const { run: runImportDataEntry, loading: importLoading } = useRequest(
    importDataEntry,
    {
      manual: true,
      onSuccess: (res) => {
        toast.success(res?.data?.message);
        navigate(ROUTE_PATH.dataEntry);
      },
      onError: (error) => handleRequestStatusError(error, navigate),
    }
  );

  const funcButtonHandleClickExecute = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (validateRequiredFields([textEmail])) {
      runImportDataEntry(buildDataEntryImportDto(textEmail));
    }
    e.preventDefault();
  };

  const emailHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextEmail(event.target.value);
  };

  const goBackHandleClick = () => {
    navigate(ROUTE_PATH.dataEntry);
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="page-title">Import data entry</h2>
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
                        required
                      />
                    </div>
                  </div>
                  <div className="form-footer">
                    <button
                      className="btn btn-primary"
                      onClick={funcButtonHandleClickExecute}
                      disabled={importLoading}
                    >
                      {importLoading && (
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

export default DataEntryImportPage;
