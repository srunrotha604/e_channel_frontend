import { useRequest } from 'ahooks';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ROUTE_PATH } from '../../../../utils/route-util';
import type {
  ProductOption,
  ProjectPolicyOption,
} from '../../../customer/entities';
import {
  fetchPoliciesByProductCode,
  fetchProductList,
} from '../../../customer/interface-adapters';
import type { BatchCustomerListResult } from '../../entities';
import ExcelUploadStep from '../components/wizard/ExcelUploadStep';
import ReviewStep from '../components/wizard/ReviewStep';
import SelectProductStep from '../components/wizard/SelectProductStep';
const STEP = {
  SELECTE_PRODUCT: 'SELECTE_PRODUCT',
  SUBMITTED: 'SUBMITTED',
  REVIEW: 'REVIEW',
};
const BatchRegisterPage = () => {
  document.title = 'E-CHANNEL PORTAL | batch register';
  const navigate = useNavigate();
  const methods = useForm();
  const [step, setStep] = useState(STEP.SELECTE_PRODUCT);
  const [arrProduct, setArrProduct] = useState<ProductOption[]>([]);
  const [arrProject, setArrProject] = useState<ProjectPolicyOption[]>([]);
  const [customerList, setCustomerList] = useState<BatchCustomerListResult>({});
  const [productCode, setProductCode] = useState('');
  useRequest(fetchProductList, {
    onSuccess: (res) => {
      switch (res?.status) {
        case 200:
          setArrProduct(res?.data?.list ?? []);
          break;
        case 400:
          toast.error(res?.data?.message ?? '');
          break;
        case 403:
          toast.error(String(res?.data));
          break;
        default:
          navigate(ROUTE_PATH.error404);
      }
    },
  });
  const { run: policyList } = useRequest(fetchPoliciesByProductCode, {
    manual: true,
    onSuccess: (res) => {
      switch (res?.status) {
        case 200:
          setArrProject(res?.data?.category ?? []);
          break;
        case 400:
          toast.error(res?.data?.message ?? '');
          break;
        case 403:
          toast.error(String(res?.data));
          break;
        default:
          navigate(ROUTE_PATH.error404);
      }
    },
  });
  const getActiveStep = () => {
    switch (step) {
      case STEP.SELECTE_PRODUCT:
        return (
          <SelectProductStep
            product={arrProduct}
            handleProductClick={handleProductClick}
          />
        );
      case STEP.SUBMITTED:
        return (
          <ExcelUploadStep
            product={productCode}
            handleGoBack={handleGoBack}
            project={arrProject}
            handleReviewStep={handleReviewStep}
          />
        );
      case STEP.REVIEW:
        return (
          <ReviewStep
            customerList={customerList}
            product={productCode}
            handleReviewBackStep={handleReviewBackStep}
          />
        );
      default:
        return (
          <SelectProductStep
            product={arrProduct}
            handleProductClick={handleProductClick}
          />
        );
    }
  };
  const handleProductClick = (value: string) => {
    policyList(value);
    setProductCode(value);
    setStep(STEP.SUBMITTED);
  };
  const handleGoBack = () => {
    setStep(STEP.SELECTE_PRODUCT);
  };
  const handleReviewStep = (value: BatchCustomerListResult) => {
    setStep(STEP.REVIEW);
    setCustomerList(value);
  };
  const handleReviewBackStep = () => {
    setStep(STEP.SUBMITTED);
  };
  return <FormProvider {...methods}>{getActiveStep()}</FormProvider>;
};
export default BatchRegisterPage;
