import { useRequest } from 'ahooks';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { handleRequestStatusError } from '../../../../utils/handleRequestStatusError';
import { ROUTE_PATH } from '../../../../utils/route-util';
import { fetchProductByKey, updateProduct } from '../../interface-adapters';
import { buildProductEditDto, validateRequiredFields } from '../../use-cases';
const ProductEditPage = () => {
  document.title = 'E-CHANNEL PORTAL | product | edit';
  const params = useParams<{ key: string }>();
  const navigate = useNavigate();
  const [productCode, setProductCode] = useState('');
  const [productName, setProductName] = useState('');
  useRequest(() => fetchProductByKey(params.key ?? ''), {
    onSuccess: (res) => {
      const data = res?.data?.list?.[0];
      setProductCode(data?.productCode ?? '');
      setProductName(data?.productName ?? '');
    },
    onError: (error) => handleRequestStatusError(error, navigate),
  });
  const { run: runUpdateProduct, loading: updateLoading } = useRequest(
    updateProduct,
    {
      manual: true,
      onSuccess: (res) => {
        toast.success(res?.data?.message);
        navigate(ROUTE_PATH.product);
      },
      onError: (error) => handleRequestStatusError(error, navigate),
    }
  );
  const funcButtonHandleClickExecute = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (validateRequiredFields([productCode, productName])) {
      runUpdateProduct(
        buildProductEditDto(params.key, productCode, productName)
      );
    }
    e.preventDefault();
  };
  const productCodeHandleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProductCode(event.target.value);
  };
  const productNameHandleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProductName(event.target.value);
  };
  const goBackHandleClick = () => {
    navigate(ROUTE_PATH.product);
  };
  return (
    <React.Fragment>
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="page-title">Product edit</h2>
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
                    <label className="form-label required">Product Label</label>
                    <div>
                      <input
                        type="text"
                        className={
                          productCode !== ''
                            ? 'form-control'
                            : 'form-control is-invalid is-invalid-lite'
                        }
                        placeholder="Product label"
                        onChange={productCodeHandleChange}
                        value={productCode}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label required">Product name</label>
                    <div>
                      <input
                        type="text"
                        className={
                          productName !== ''
                            ? 'form-control'
                            : 'form-control is-invalid is-invalid-lite'
                        }
                        placeholder="Product name"
                        onChange={productNameHandleChange}
                        value={productName}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-footer">
                    <button
                      className="btn btn-primary"
                      onClick={funcButtonHandleClickExecute}
                      disabled={updateLoading}
                    >
                      {updateLoading ? (
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
export default ProductEditPage;
