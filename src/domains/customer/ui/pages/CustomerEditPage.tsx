import { useRequest } from 'ahooks';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner, { useSpinner } from '../../../../components/common/Spinner';
import { handleRequestStatusError } from '../../../../utils/handleRequestStatusError';
import type { ProjectPolicyOption } from '../../entities';
import { fetchPoliciesByProductCode } from '../../interface-adapters';
import CostomerTransationSubmit from '../components/create/CustomerTransationSubmit';
import CustomerEdit from '../components/edit/CustomerEdit';
import CustomerEditReview from '../components/edit/CustomerEditReview';
const STEP = {
  Edited: 'Edited',
  Review: 'Review',
  Submitted: 'Submitted',
};
const CustomerEditPage = () => {
  document.title = 'E-CHANNEL PORTAL | customer edit';
  const params = useParams();

  const [product, setProduct] = useState('');
  const [arrProject, setArrProject] = useState<ProjectPolicyOption[]>([]);
  const [transactionSubmitted, setTransationSubmitted] = useState<unknown>({});
  const [step, setStep] = useState(STEP.Edited);
  const methods = useForm();
  const navigate = useNavigate();
  useRequest(() => fetchPoliciesByProductCode(params.productCode ?? ''), {
    onSuccess: (res) => {
      setArrProject(res?.data?.category ?? []);
    },
    onError: (error) => handleRequestStatusError(error, navigate),
  });

  const { spinnerState, openSpinner, closeSpinner } = useSpinner();

  useEffect(() => {
    openSpinner();
  }, []);

  const getActiveStep = () => {
    switch (step) {
      case STEP.Review:
        return (
          <CustomerEditReview
            handleBackStep={handleBackStep}
            handleSubmitted={handleSubmitted}
            productName={product}
          />
        );
      case STEP.Submitted:
        return (
          <CostomerTransationSubmit
            productName={product}
            data={transactionSubmitted}
          />
        );
      default:
        return (
          <CustomerEdit
            closeSpinner={closeSpinner}
            setProduct={setProduct}
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
    if (submitData.status === 'Draft') {
      navigate(-1);
    } else {
      setTransationSubmitted(responseData);
      setStep(STEP.Submitted);
    }
  };

  const handleBackStep = () => {
    setStep(STEP.Edited);
  };

  return (
    <FormProvider {...methods}>
      <Spinner {...spinnerState} />
      <div className="page-wrapper full-height-dashboard-container">
        {getActiveStep()}
      </div>
    </FormProvider>
  );
};

export default CustomerEditPage;
