import type { ProductOption } from '../../../../customer/entities';
interface SelectProductStepProps {
  product: ProductOption[];
  handleProductClick: (productCode: string) => void;
}
const SelectProductStep = (props: SelectProductStepProps) => {
  const { product, handleProductClick } = props;
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
                      {product?.map((item, index) => (
                        <button
                          className="btn btn-primary d-sm-inline-block"
                          key={index}
                          onClick={() =>
                            item.productsequenceCode &&
                            handleProductClick(item.productsequenceCode)
                          }
                          type="button"
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
export default SelectProductStep;
