import JoditEditor from 'jodit-react';
import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { NumericFormat } from 'react-number-format';
import { Link } from 'react-router-dom';
import Spinner, { useSpinner } from '../../../../components/common/Spinner';
import { useTheme } from '../../../../context/ThemeContext';
import useMessage from '../../../../hooks/useMessage';
import { contactUs } from '../../../../utils/contact';
import { delay } from '../../../../utils/delay';
import { ROUTE_PATH } from '../../../../utils/route-util';
import { submitContactUs } from '../../interface-adapters';
interface ContactUsFormValues {
  phone: string;
  message: string;
}
const ContactUsPage = () => {
  document.title = 'E-CHANNEL PORTAL | Contact Us';
  const { control, handleSubmit, watch } = useForm<ContactUsFormValues>();
  const data = watch();
  const [success, setSuccess] = useState(false);
  const { theme } = useTheme();
  const joditConfig = useMemo(
    () => ({ ...config, theme: theme === 'dark' ? 'dark' : 'default' }),
    [theme]
  );
  const { spinnerState, openSpinner, closeSpinner } = useSpinner();
  const { showErrorResponseMessage } = useMessage();
  const onSubmit = async (data: ContactUsFormValues) => {
    try {
      openSpinner();
      const response = await submitContactUs(data);
      if (response?.status && response.status >= 200 && response.status < 300) {
        setSuccess(true);
      } else {
        showErrorResponseMessage(response);
      }
    } catch (error) {
      showErrorResponseMessage(error);
    } finally {
      delay(closeSpinner);
    }
  };
  return (
    <div className="page-wrapper full-height-dashboard-container">
      <div className="page-body">
        {!success ? (
          <div className="container-xl">
            <div className="card">
              <div className="card-header">
                <h2 className="mb-0">Contact Us</h2>
              </div>
              <div className="card-body">
                <h3>Let us know how we can help you</h3>
                <div className="row">
                  <div className="col-md-6">
                    <h4>Customer Service/ Sale Support</h4>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                        columnGap: '6px',
                      }}
                    >
                      <p className="mb-1">Telephone:</p>
                      {contactUs.customerService.phone.map((phone, index) => (
                        <React.Fragment key={index}>
                          {index > 0 && <div></div>}
                          <p className="mb-1">
                            <a href={`tel:${phone}`}>{phone}</a>
                          </p>
                        </React.Fragment>
                      ))}
                    </div>
                    <p>
                      Email:{' '}
                      <a href={`mailto:${contactUs.customerService.email[0]}`}>
                        {contactUs.customerService.email[0]}
                      </a>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h4>Technical Support</h4>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                        columnGap: '6px',
                      }}
                    >
                      <p className="mb-1">Telephone:</p>
                      {contactUs.technicalSupport.phone.map((phone, index) => (
                        <React.Fragment key={index}>
                          {index > 0 && <div></div>}
                          <p className="mb-1">
                            <a href={`tel:${phone}`}>{phone}</a>
                          </p>
                        </React.Fragment>
                      ))}
                    </div>
                    <p className="mb-2">
                      Email:{' '}
                      <a href={`mailto:${contactUs.technicalSupport.email[0]}`}>
                        {contactUs.technicalSupport.email[0]}
                      </a>
                    </p>
                  </div>
                </div>
                <h3>Report a Techinal Problem</h3>
                <div className="row">
                  <div className="col-md-3 mb-2">
                    <div className="form-group">
                      <label className={'mb-1'} htmlFor="contact">
                        <b>Contact Number</b>
                      </label>
                      <Controller
                        control={control}
                        rules={{ minLength: 9, maxLength: 25 }}
                        render={({ field: { value, onChange, ref } }) => (
                          <NumericFormat
                            allowLeadingZeros
                            minLength={9}
                            className="form-control"
                            getInputRef={ref}
                            id="contact"
                            maxLength={25}
                            required
                            value={value}
                            onChange={onChange}
                            placeholder="Enter your contact number here..."
                          />
                        )}
                        name={'phone'}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <label className={'mb-1'} htmlFor="message">
                      <b>What can we help you with?</b>
                    </label>
                    <Controller
                      defaultValue={''}
                      name="message"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <JoditEditor
                          value={value}
                          onChange={(newContent) => {
                            onChange(newContent);
                          }}
                          config={joditConfig}
                        />
                      )}
                    ></Controller>
                  </div>
                  <div className="col-md-12 mt-2">
                    <button
                      disabled={!data?.message || !data?.phone}
                      onClick={handleSubmit(onSubmit)}
                      className="btn btn-primary"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="container-tight w-100">
            <div className="card card-md w-100 p-1">
              <div className="card-body ">
                <div className="text-center text-green mt-2">
                  <div className="my-3">
                    <AiOutlineCheckCircle style={{ fontSize: '48px' }} />
                  </div>
                  <h4 className="text-dark">
                    Thank you for reporting the technical problem!
                  </h4>
                  <p className="text-dark">
                    Your report has been successfully submitted and our team
                    will investigate the issue as soon as possible, any updates
                    regarding to this problem will be sent to your email.
                  </p>
                  <p className="text-dark"></p>
                  <div className="mt-3">
                    <Link to={ROUTE_PATH.dashboard} className="btn btn-primary">
                      Back to Home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Spinner {...spinnerState} />
    </div>
  );
};
const config = {
  showCharsCounter: false,
  showWordsCounter: false,
  showXPathInStatusbar: false,
  uploader: {
    insertImageAsBase64URI: true,
  },
  placeholder: 'Enter your problem here....',
  height: '400px',
  buttons: [
    'paragraph',
    'bold',
    'strikethrough',
    'underline',
    'italic',
    '|',
    'ul',
    'ol',
    '|',
    'outdent',
    'indent',
    '|',
    'fontsize',
    'brush',
    '|',
    'image',
    'table',
    'link',
    '|',
    'align',
    'undo',
    'redo',
    '|',
    'hr',
    'eraser',
    '|',
  ],
};
export default ContactUsPage;
