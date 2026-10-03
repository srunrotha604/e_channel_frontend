import { useRequest } from 'ahooks';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleRequestStatusError } from '../../../../utils/handleRequestStatusError';
import { ROUTE_PATH } from '../../../../utils/route-util';
import type { ProductOption } from '../../entities';
import { fetchProductList } from '../../interface-adapters';
const InsuranceProductPage = () => {
  document.title = 'E-CHANNEL PORTAL | insurance product';
  const navigate = useNavigate();
  const [arrProduct, setArrProduct] = useState<ProductOption[]>([]);
  useRequest(fetchProductList, {
    onSuccess: (res) => {
      setArrProduct(res?.data?.list ?? []);
    },
    onError: (error) => handleRequestStatusError(error, navigate),
  });

  const productHandleClick = (productCode?: string) => {
    navigate(ROUTE_PATH.customerCreateWithProduct(productCode ?? ''));
  };
  return (
    <div className="page-wrapper full-height-dashboard-container justify-content-center">
      <div className="page-body">
        <div className="container-xl">
          <div className="row row-deck row-cards">
            <div className="col-12">
              <div className="container-tight py-1">
                <form
                  className="card card-md"
                  action="."
                  method="get"
                  autoComplete="off"
                >
                  <div className="card-header">
                    <h2 className="card-title text-center">
                      Choose Insurance Product
                    </h2>
                  </div>
                  <div className="card-body">
                    <div className="btn-list">
                      {arrProduct?.map((item, index) => (
                        <button
                          type="button"
                          className="btn btn-primary d-sm-inline-block"
                          key={index}
                          onClick={() =>
                            productHandleClick(item.productsequenceCode)
                          }
                        >
                          {item.productCode}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceProductPage;
