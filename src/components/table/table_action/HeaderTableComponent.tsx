import type { ReactNode } from 'react';
import { Tooltip } from 'react-tooltip';
import ArrowBackIcon from '../../Icons/ArrowBackIcon';
import PlusIcon from '../../Icons/PlusIcon';
import RefreshIcon from '../../Icons/RefreshIcon';
interface HeaderTableComponentProps {
  title?: ReactNode;
  refreshOnClick?: () => void;
  createOnClick?: () => void;
  refresh?: boolean;
  create?: boolean;
  back?: () => void;
  multiRef?: ReactNode;
}
const HeaderTableComponent = (props: HeaderTableComponentProps) => {
  const {
    title,
    refreshOnClick,
    createOnClick,
    refresh,
    create,
    back,
    multiRef,
  } = props;
  return (
    <div className="container-xl">
      <div className="page-header d-print-none">
        <div className="row align-items-center">
          <div className="col">
            <h2 className="page-title">{title}</h2>
          </div>
          <div className="col-auto ms-auto d-print-none">
            <div className="row align-items-center">
              <div className="col-auto ms-auto d-print-none">
                <div className="btn-list">
                  {refresh ? (
                    <>
                      <button
                        className="btn btn-primary d-none d-sm-inline-block"
                        onClick={refreshOnClick}
                      >
                        <RefreshIcon />
                        Refresh
                      </button>
                      <button
                        className="btn btn-primary d-sm-none btn-icon"
                        data-tooltip-id="refresh-tooltip"
                        data-tooltip-content="Refresh"
                        onClick={refreshOnClick}
                      >
                        <RefreshIcon />
                      </button>
                      <Tooltip id="refresh-tooltip" place="right" />
                    </>
                  ) : (
                    ''
                  )}
                  {back ? (
                    <>
                      <button
                        className="btn btn-primary d-none d-sm-inline-block"
                        onClick={back}
                      >
                        <ArrowBackIcon />
                        Back
                      </button>
                      <button
                        className="btn btn-primary d-sm-none btn-icon"
                        data-tooltip-id="new-tooltip"
                        data-tooltip-content="Add new"
                        onClick={back}
                      >
                        <ArrowBackIcon />
                      </button>
                      <Tooltip id="new-tooltip" place="right" />
                    </>
                  ) : (
                    ''
                  )}
                  {multiRef ? <>{multiRef}</> : ''}
                  {create ? (
                    <>
                      <button
                        className="btn btn-primary d-none d-sm-inline-block"
                        onClick={createOnClick}
                      >
                        <PlusIcon />
                        New
                      </button>
                      <button
                        className="btn btn-primary d-sm-none btn-icon"
                        data-tooltip-id="new-tooltip"
                        data-tooltip-content="Add new"
                        onClick={createOnClick}
                      >
                        <PlusIcon />
                      </button>
                      <Tooltip id="new-tooltip" place="right" />
                    </>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HeaderTableComponent;
