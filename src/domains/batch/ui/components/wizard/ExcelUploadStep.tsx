import { useRequest } from 'ahooks';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import type { FileWithPath } from 'react-dropzone';
import { useDropzone } from 'react-dropzone';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { MdDownload } from 'react-icons/md';
import { redirect } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import ExcelIcon from '../../../../../assets/Excel.svg';
import ActionConfirmationModal from '../../../../../components/common/ActionConfirmationModal';
import Button from '../../../../../components/common/Button';
import { useModal } from '../../../../../components/common/modal/index';
import Image from '../../../../../components/Image';
import { ROUTE_PATH } from '../../../../../utils/route-util';
import type { ProjectPolicyOption } from '../../../../customer/entities';
import type { BatchCustomerListResult } from '../../../entities';
import { uploadBatchExcel } from '../../../interface-adapters';
const downloadUrl =
  import.meta.env.VITE_API_URL + '/operation-customer/batch/download';
type PolicyOption = NonNullable<ProjectPolicyOption['policies']>[number];
interface ExcelUploadStepProps {
  project: ProjectPolicyOption[];
  handleReviewStep: (value: BatchCustomerListResult, product?: string) => void;
  handleGoBack: () => void;
  product: string;
}
const ExcelUploadStep = (props: ExcelUploadStepProps) => {
  const { project, handleReviewStep, handleGoBack, product } = props;
  const [policy, setPolicy] = useState<
    NonNullable<ProjectPolicyOption['policies']>
  >([]);
  const { control, handleSubmit, reset, getValues, setValue } =
    useFormContext();
  const [myFiles, setMyFiles] = useState<FileWithPath[]>([]);
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setMyFiles([...acceptedFiles]);
    },
    [myFiles]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xlsx', '.xls'],
    },
    multiple: false,
  });
  const { modalRef, closeModal, openModal } = useModal();
  const removeFile = (file: FileWithPath) => () => {
    const newFiles = [...myFiles];
    newFiles.splice(newFiles.indexOf(file), 1);
    setMyFiles(newFiles);
  };
  const files = myFiles.map((file) => (
    <li key={file.path} className="mt-2">
      {file.path} - {file.size} bytes
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-trash ml-5 cursor-pointer"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="#ff2825"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        onClick={removeFile(file)}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <line x1={4} y1={7} x2={20} y2={7} />
        <line x1={10} y1={11} x2={10} y2={17} />
        <line x1={14} y1={11} x2={14} y2={17} />
        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
      </svg>
    </li>
  ));
  const resetHandleClick = () => {
    reset({
      gender: '',
      dateOfBirth: '',
      nation: '',
      physicalCard: '',
      policy: '',
      project: '',
      telNo: '',
      position: '',
      identifyNumber: '',
    });
    setPolicy([]);
  };
  const { run: runUploadBatchExcel, loading } = useRequest(uploadBatchExcel, {
    manual: true,
    onSuccess: (res) => {
      switch (res?.status) {
        case 200:
          handleReviewStep(res?.data ?? {}, product);
          break;
        case 400:
          toast.error(res?.data?.message ?? '');
          break;
        case 403:
          toast.error(String(res?.data));
          break;
        default:
          redirect(ROUTE_PATH.error404);
      }
    },
  });
  const onSubmit = (data: {
    project?: { value?: string };
    policy?: { value?: string };
  }) => {
    runUploadBatchExcel(myFiles, {
      ProjectCode: data.project?.value,
      Policies: data.policy?.value,
      ProductCode: product,
    });
  };
  const projectWatch = useWatch({ control, name: 'project' });
  useEffect(() => {
    if (!projectWatch) {
      setPolicy([]);
      setValue('policy', null, { shouldValidate: true, shouldDirty: true });
      return;
    }
    const policies = projectWatch?.policies ?? [];
    setPolicy(policies);
    const currentPolicy = getValues('policy');
    const stillValid =
      currentPolicy &&
      policies.some(
        (p: { value?: string }) =>
          String(p.value) === String(currentPolicy.value)
      );
    const nextPolicy = stillValid ? currentPolicy : policies[0] ?? null;
    setValue('policy', nextPolicy, { shouldValidate: true, shouldDirty: true });
  }, [projectWatch, getValues, setValue]);
  const downloadExcelTemplate = () => {
    closeModal();
    document.querySelector<HTMLAnchorElement>('#excel-template')?.click();
  };
  return (
    <div className="page-wrapper">
      <div className="container-xl">
        <div className="page-header d-print-none">
          <div className="row align-items-center">
            <div className="col">
              <h2 className="page-title">BATCH REGISTER</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="page-body">
        <div className="container-xl">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mt-10">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label required">Project</label>
                      </div>
                      <Controller
                        name="project"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, ref } }) => (
                          <Select
                            ref={ref}
                            value={value}
                            options={project}
                            getOptionLabel={(o: ProjectPolicyOption) =>
                              o.label ?? ''
                            }
                            getOptionValue={(o: ProjectPolicyOption) =>
                              String(o.value)
                            }
                            onChange={(val) => {
                              onChange(val);
                            }}
                            placeholder="Select a project..."
                          />
                        )}
                      />
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label required">Policy</label>
                      </div>
                      <Controller
                        name="policy"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, ref } }) => (
                          <Select
                            ref={ref}
                            value={value}
                            options={policy}
                            getOptionLabel={(o: PolicyOption) => o.label ?? ''}
                            getOptionValue={(o: PolicyOption) =>
                              String(o.value)
                            }
                            isDisabled={!policy?.length}
                            onChange={(val) => {
                              onChange(val || null);
                            }}
                            placeholder={
                              policy?.length
                                ? 'Select a policy...'
                                : 'Select a project first'
                            }
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="card">
                        <div className="card-body">
                          <div className="card-title">
                            <div className="flex">
                              <Image url={ExcelIcon} name="Excel" width={20} />
                              <span className="ml-5">Excel template</span>
                              <a
                                href={downloadUrl}
                                id="excel-template"
                                download
                              />
                              <div
                                onClick={openModal}
                                className="mx-1 text-green cursor-pointer"
                              >
                                <MdDownload style={{ fontSize: '24px' }} />
                              </div>
                            </div>
                          </div>
                          <div
                            {...getRootProps({
                              className: clsx('dropzone cursor-pointer', {
                                ['border-primary']: isDragActive,
                              }),
                            })}
                          >
                            <input {...getInputProps()} />
                            <h4 className="text-center text-primary text-underline">
                              Select File to Upload
                            </h4>
                            <p className="text-center">
                              or drag and drop some files here
                            </p>
                          </div>
                          <aside>
                            <h4 className="mt-10">Files name</h4>
                            <ul className="text-primary">{files}</ul>
                          </aside>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-footer">
                  <div className="btn-list">
                    <button
                      onClick={handleGoBack}
                      className="btn btn-secondary"
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-danger"
                      type="button"
                      onClick={resetHandleClick}
                    >
                      Reset
                    </button>
                    <Button
                      loading={loading}
                      loadingText="Processing..."
                      type="submit"
                      disabled={myFiles.length === 0 || loading}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ActionConfirmationModal
        closeModal={closeModal}
        modalRef={modalRef}
        isApprove
        confirmMessageText="Are you sure you want to download the excel template?"
        onApprove={downloadExcelTemplate}
        onReject={() => {}}
      />
    </div>
  );
};
export default ExcelUploadStep;
