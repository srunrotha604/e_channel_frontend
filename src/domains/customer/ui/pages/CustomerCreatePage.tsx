import { useRequest } from 'ahooks';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ROUTE_PATH } from '../../../../utils/route-util';
import type { ProductOption, ProjectPolicyOption } from '../../entities';
import { fetchProductAndPoliciesBySequenceCode } from '../../interface-adapters';
import CustomerCreate from '../components/create/CustomerCreate';
import CustomerCreateReview from '../components/create/CustomerCreateReview';
import CostomerTransationSubmit from '../components/create/CustomerTransationSubmit';
const STEP = {
  Create: 'create',
  Review: 'Review',
  Submitted: 'Submitted',
};
const CustomerCreatePage = () => {
  document.title = 'E-CHANNEL PORTAL | customer create';
  const params = useParams();
  const navigate = useNavigate();

  const [arrProduct, setArrProduct] = useState<ProductOption | undefined>(
    undefined
  );
  const [arrProject, setArrProject] = useState<ProjectPolicyOption[]>([]);
  const [transactionSubmitted, setTransationSubmitted] = useState<unknown>({});
  const [step, setStep] = useState(STEP.Create);
  const methods = useForm();

  useRequest(() => fetchProductAndPoliciesBySequenceCode(params.key ?? ''), {
    onSuccess: (res) => {
      switch (res?.status) {
        case 200:
          setArrProduct(
            res?.data?.list?.find(
              (item) => item?.productsequenceCode === params.key
            )
          );
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
      case STEP.Review:
        return (
          <CustomerCreateReview
            productName={arrProduct?.productName}
            handleBackStep={handleBackStep}
            handleSubmitted={handleSubmitted}
          />
        );
      case STEP.Submitted:
        return (
          <CostomerTransationSubmit
            productName={arrProduct?.productName}
            data={transactionSubmitted}
          />
        );
      default:
        return (
          <CustomerCreate
            productName={arrProduct?.productName}
            project={arrProject}
            handleNextStep={handleNextStep}
          />
        );
    }
  };

  const handleNextStep = () => {
    setStep(STEP.Review);
  };

  const handleSubmitted = (
    responseData: unknown,
    submitData: { status?: string }
  ) => {
    if (submitData?.status === 'Draft') {
      toast.success('Save draft successfully');
      navigate(ROUTE_PATH.dashboard);
    } else {
      setTransationSubmitted(responseData);
      setStep(STEP.Submitted);
    }
  };

  const handleBackStep = () => {
    setStep(STEP.Create);
  };

  return (
    <FormProvider {...methods}>
      <div className="page-wrapper full-height-dashboard-container">
        {getActiveStep()}
      </div>
    </FormProvider>
  );
};

export default CustomerCreatePage;
