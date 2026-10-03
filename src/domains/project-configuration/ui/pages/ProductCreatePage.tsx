import { useRequest } from 'ahooks';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select, { SingleValue } from 'react-select';
import { toast } from 'react-toastify';
import type { ProductSelectOption } from '../../../../@type/report';
import { handleRequestStatusError } from '../../../../utils/handleRequestStatusError';
import { ROUTE_PATH } from '../../../../utils/route-util';
import { createProduct, fetchProductOptions } from '../../interface-adapters';
import { buildProductCreateDto, validateRequiredFields } from '../../use-cases';
const ProductCreatePage = () => {
  document.title = 'E-CHANNEL PORTAL | product | create';
  const navigate = useNavigate();
  const [productCode, setProductCode] = useState('');
  const [productName, setProductName] = useState('');
  const [productList, setProductList] = useState<ProductSelectOption[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  useRequest(fetchProductOptions, {
    onSuccess: (res) => {
      setProductList(res?.data?.options ?? []);
    },
    onError: (error) => handleRequestStatusError(error, navigate),
  });
  const { run: runCreateProduct, loading: createLoading } = useRequest(
    createProduct,
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
    if (validateRequiredFields([selectedProduct, productCode, productName])) {
      runCreateProduct(
        buildProductCreateDto(selectedProduct, productCode, productName)
      );
    }
    e.preventDefault();
  };
  const roleHandleChange = (value: SingleValue<ProductSelectOption>) => {
    setSelectedProduct(value?.productCode ?? '');
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
                <h2 className="page-title">Product create</h2>
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
                    <label className="form-label required">Product code</label>
                    <div>
                      <Select
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        menuPortalTarget={document.body}
                        getOptionLabel={(option) =>
                          `${option.productCode + '-' + option.productName}`
                        }
                        getOptionValue={(option) => option.productCode}
                        value={productList.find(function (option) {
                          return option.productCode === selectedProduct;
                        })}
                        onChange={roleHandleChange}
                        options={productList}
                        required
                      />
                    </div>
                  </div>
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
export default ProductCreatePage;
