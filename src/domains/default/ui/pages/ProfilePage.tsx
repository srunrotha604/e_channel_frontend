import { useRequest } from 'ahooks';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { UserProfile } from '../../../../@type/profile';
import { handleRequestStatusError } from '../../../../utils/handleRequestStatusError';
import { ROUTE_PATH } from '../../../../utils/route-util';
import {
  fetchCurrentUserProfile,
  saveProfileInfo,
  uploadProfileAvatar,
} from '../../interface-adapters';
import { buildProfileUpdateDto } from '../../use-cases';
const ProfilePage = () => {
  const navigate = useNavigate();
  document.title = 'E-CHANNEL PORTAL | Profile';
  const [arrProfile, setArrProfile] = useState<UserProfile | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | ''>('');
  const [email1, setEmail1] = useState('');
  // const [email2, setEmail2] = useState('');
  // const [phone1, setPhone1] = useState('');
  // const [phone2, setPhone2] = useState('');
  // const [website1, setWebsite1] = useState('');
  // const [website2, setWebsite2] = useState('');
  // const [otherContact, setOtherContact] = useState('');
  // const [address1, setAddress1] = useState('');
  // const [address2, setAddress2] = useState('');
  const [userCode, setUserCode] = useState('');
  const [roleName, setRoleName] = useState('');
  const { loading: profileLoading } = useRequest(fetchCurrentUserProfile, {
    onSuccess: (res) => {
      const profile = res?.data?.userProfile;
      if (profile) {
        setArrProfile(profile);
        setRoleName(res.data.application.roleName);
        setEmail1(profile.email ?? '');
        // setEmail2(profile.email2 ?? '');
        // setPhone1(profile.phone1 ?? '');
        // setPhone2(profile.phone2 ?? '');
        // setWebsite1(profile.website1 ?? '');
        // setWebsite2(profile.website2 ?? '');
        // setOtherContact(profile.otherContact ?? '');
        // setAddress1(profile.address1 ?? '');
        // setAddress2(profile.address2 ?? '');
        setUserCode(profile.channelUuid ?? '');
      }
    },
    onError: (error) => handleRequestStatusError(error, navigate),
  });
  const { run: uploadAvatar, loading: uploadLoading } = useRequest(
    uploadProfileAvatar,
    {
      manual: true,
      onSuccess: (res) => {
        toast.success(res?.data?.message ?? '');
        window.location.reload();
      },
      onError: (error) => handleRequestStatusError(error, navigate),
    }
  );
  const { run: saveProfile, loading: saveLoading } = useRequest(
    saveProfileInfo,
    {
      manual: true,
      onSuccess: (res) => {
        toast.success(res?.data?.message ?? '');
        window.location.reload();
      },
      onError: (error) => handleRequestStatusError(error, navigate),
    }
  );
  const profileUploadHandleClickExecute = () => {
    if (selectedFile !== '') {
      const formData = new FormData();
      formData.append('selectedFile', selectedFile);
      uploadAvatar(formData);
    }
  };
  const saveChangeHandleExecute = () => {
    saveProfile(
      buildProfileUpdateDto({
        userCode,
        email1,
      })
    );
  };
  const goBackHandleClick = () => {
    navigate(ROUTE_PATH.dashboard);
  };
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };
  return (
    <React.Fragment>
      <div className="page-wrapper">
        <div className="page-body">
          <div className="container-xl">
            <div className="row row-cards">
              <div className="col-lg-4">
                <div className="card">
                  <div className="card-status-top bg-primary" />
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <div>
                        <h3 className="lh-1">Profile User</h3>
                      </div>
                      {profileLoading && (
                        <span
                          className="spinner-border spinner-border-sm ms-2"
                          role="status"
                        />
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        borderRadius: 50,
                      }}
                    >
                      <img
                        src={arrProfile?.avatarUrl}
                        alt={arrProfile?.avatarUrl}
                        className="profile-image-details"
                      />
                    </div>
                    <div className="input-group input-group-flat mb-3 mt-3">
                      <input
                        type="file"
                        className="form-control"
                        onChange={handleFileSelect}
                        accept=".jpg,.jpeg,.png"
                      />
                      <span className="input-group-text">
                        {uploadLoading ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                          />
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon cursor-pointer"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            onClick={profileUploadHandleClickExecute}
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <polyline points="9 11 12 14 20 6" />
                            <path d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9" />
                          </svg>
                        )}
                      </span>
                    </div>
                    <ul className="list-unstyled space-y-2 mt-3">
                      <li>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="#4F4F4F"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <circle cx={12} cy={7} r={4} />
                          <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                        </svg>
                        <span className="p-l-10">
                          {arrProfile?.firstName} {arrProfile?.lastName}
                        </span>
                      </li>
                      <li>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="#4F4F4F"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <line x1={3} y1={21} x2={21} y2={21} />
                          <path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16" />
                          <path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4" />
                          <line x1={10} y1={9} x2={14} y2={9} />
                          <line x1={12} y1={7} x2={12} y2={11} />
                        </svg>
                        <span className="p-l-10">{roleName}</span>
                      </li>
                      <li>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="#4F4F4F"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <rect x={3} y={5} width={18} height={14} rx={2} />
                          <polyline points="3 7 12 13 21 7" />
                        </svg>
                        <span className="p-l-10">{arrProfile?.email}</span>
                      </li>
                      {/* <li>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="#4F4F4F"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <rect x={7} y={4} width={10} height={16} rx={1} />
                          <line x1={11} y1={5} x2={13} y2={5} />
                          <line x1={12} y1={17} x2={12} y2="17.01" />
                        </svg>
                        <span className="p-l-10">{arrProfile?.phone1}</span>
                      </li> */}
                    </ul>
                  </div>
                </div>
                {/* <div className="card mt-3">
                  <div className="card-status-top bg-primary" />
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <div>
                        <h3 className="lh-1">About Me</h3>
                      </div>
                    </div>
                    <ul className="list-unstyled space-y-2 mt-3">
                      <li>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon font-bold"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="#4F4F4F"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <rect x={3} y={5} width={18} height={14} rx={2} />
                          <polyline points="3 7 12 13 21 7" />
                        </svg>
                        <span className="p-l-5 font-bold">Email :</span>
                        <div className="text-secondary">
                          {arrProfile?.email}
                        </div>
                      </li>
                      <div className="line-dropdown-menu"></div>
                      <li>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon font-bold"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="#4F4F4F"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <rect x={3} y={5} width={18} height={14} rx={2} />
                          <polyline points="3 7 12 13 21 7" />
                        </svg>
                        <span className="p-l-5 font-bold">Email 2:</span>
                        <div className="text-secondary">
                          {arrProfile?.email2}
                        </div>
                      </li>
                      <div className="line-dropdown-menu"></div>
                      <li>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon font-bold"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="#4F4F4F"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <rect x={7} y={4} width={10} height={16} rx={1} />
                          <line x1={11} y1={5} x2={13} y2={5} />
                          <line x1={12} y1={17} x2={12} y2="17.01" />
                        </svg>

                        <span className="p-l-5 font-bold">Phone 1:</span>
                        <div className="text-secondary">
                          {arrProfile?.phone1}
                        </div>
                      </li>
                      <div className="line-dropdown-menu"></div>
                      <li>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon font-bold"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="#4F4F4F"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <rect x={7} y={4} width={10} height={16} rx={1} />
                          <line x1={11} y1={5} x2={13} y2={5} />
                          <line x1={12} y1={17} x2={12} y2="17.01" />
                        </svg>

                        <span className="p-l-5 font-bold">Phone 2:</span>
                        <div className="text-secondary">
                          {arrProfile?.phone2}
                        </div>
                      </li>
                      <div className="line-dropdown-menu"></div>
                      <li>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon font-bold"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="#4F4F4F"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <rect x={7} y={4} width={10} height={16} rx={1} />
                          <line x1={11} y1={5} x2={13} y2={5} />
                          <line x1={12} y1={17} x2={12} y2="17.01" />
                        </svg>

                        <span className="p-l-5 font-bold">Website 1:</span>
                        <div className="text-secondary">
                          {arrProfile?.website1}
                        </div>
                      </li>
                      <div className="line-dropdown-menu"></div>
                      <li>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon font-bold"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="#4F4F4F"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <rect x={7} y={4} width={10} height={16} rx={1} />
                          <line x1={11} y1={5} x2={13} y2={5} />
                          <line x1={12} y1={17} x2={12} y2="17.01" />
                        </svg>

                        <span className="p-l-5 font-bold">Website 2:</span>
                        <div className="text-secondary">
                          {arrProfile?.website2}
                        </div>
                      </li>
                      <div className="line-dropdown-menu"></div>
                      <li>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-tabler icon-tabler-bookmark"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="#4F4F4F"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M9 4h6a2 2 0 0 1 2 2v14l-5 -3l-5 3v-14a2 2 0 0 1 2 -2" />
                        </svg>

                        <span className="p-l-5 font-bold">Other Contact:</span>
                        <div className="text-secondary">
                          {arrProfile?.otherContact}
                        </div>
                      </li>
                      <div className="line-dropdown-menu"></div>
                      <li>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-tabler icon-tabler-map-pin"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="#4F4F4F"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <circle cx={12} cy={11} r={3} />
                          <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
                        </svg>
                        <span className="p-l-5 font-bold">Address 1:</span>
                        <div className="text-secondary">
                          {arrProfile?.address1}
                        </div>
                      </li>
                      <div className="line-dropdown-menu"></div>
                      <li>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-tabler icon-tabler-map-pin"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="#4F4F4F"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <circle cx={12} cy={11} r={3} />
                          <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
                        </svg>
                        <span className="p-l-5 font-bold">Address 2:</span>
                        <div className="text-secondary">
                          {arrProfile?.address2}
                        </div>
                      </li>
                      <div className="line-dropdown-menu"></div>
                    </ul>
                  </div>
                </div> */}
              </div>
              <div className="col-lg-8">
                <div className="card">
                  <div className="card-status-top bg-primary" />
                  <div className="card-body">
                    <div className="form-group mb-3">
                      <label className="form-label">Email </label>
                      <div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Email 1"
                          onChange={(e) => setEmail1(e.target.value)}
                          value={email1}
                          required
                        />
                      </div>
                    </div>
                    {/* <div className="form-group mb-3">
                      <label className="form-label">Email 2</label>
                      <div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Email 2"
                          onChange={(e) => setEmail2(e.target.value)}
                          value={email2}
                          required
                        />
                      </div>
                    </div> */}
                    {/* <div className="form-group mb-3">
                      <label className="form-label">Phone</label>
                      <div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Phone 1"
                          onChange={(e) => setPhone1(e.target.value)}
                          value={phone1}
                          required
                        />
                      </div>
                    </div> */}
                    {/* <div className="form-group mb-3">
                      <label className="form-label">Phone 2</label>
                      <div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Phone 2"
                          onChange={(e) => setPhone2(e.target.value)}
                          value={phone2}
                          required
                        />
                      </div>
                    </div> */}
                    {/* <div className="form-group mb-3">
                      <label className="form-label">Website 1</label>
                      <div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Website 1"
                          onChange={(e) => setWebsite1(e.target.value)}
                          value={website1}
                          required
                        />
                      </div>
                    </div> */}
                    {/* <div className="form-group mb-3">
                      <label className="form-label">Website 2</label>
                      <div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Website 2"
                          onChange={(e) => setWebsite2(e.target.value)}
                          value={website2}
                          required
                        />
                      </div>
                    </div> */}
                    {/* <div className="form-group mb-3">
                      <label className="form-label">Other Contact</label>
                      <div>
                        <textarea
                          className="form-control"
                          placeholder="Other Contact"
                          rows={3}
                          onChange={(e) => setOtherContact(e.target.value)}
                          value={otherContact}
                        />
                      </div>
                    </div> */}
                    {/* <div className="form-group mb-3">
                      <label className="form-label">Address 1</label>
                      <div>
                        <textarea
                          className="form-control"
                          placeholder="Address 1"
                          rows={5}
                          onChange={(e) => setAddress1(e.target.value)}
                          value={address1}
                        />
                      </div>
                    </div> */}
                    {/* <div className="form-group mb-3">
                      <label className="form-label">Address 2</label>
                      <div>
                        <textarea
                          className="form-control"
                          placeholder="Address 2"
                          rows={5}
                          onChange={(e) => setAddress2(e.target.value)}
                          value={address2}
                        />
                      </div>
                    </div> */}
                    <div className="btn-list">
                      <button
                        className="btn btn-primary"
                        onClick={saveChangeHandleExecute}
                        disabled={saveLoading}
                      >
                        {saveLoading ? (
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          />
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
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
                            <polyline points="9 11 12 14 20 6" />
                            <path d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9" />
                          </svg>
                        )}
                        Save change
                      </button>
                      <button
                        className="btn btn-primary"
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
                    </div>
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

export default ProfilePage;
