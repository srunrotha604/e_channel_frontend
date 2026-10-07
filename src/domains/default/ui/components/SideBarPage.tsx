import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';
import { LuUserPlus } from 'react-icons/lu';
import { RxHome } from 'react-icons/rx';
import { TbReport, TbSettings } from 'react-icons/tb';
import type { NavLinkProps } from 'react-router-dom';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Select from 'react-select';
import type {
  CompanyBranchOption,
  SelectOption,
} from '../../../../@type/report';
import '../../../../assets/style/custom_style.css';
import Modal, { useModal } from '../../../../components/common/modal';
import { useAuth } from '../../../../context/AuthContext';
import { useModulePermission } from '../../../../context/module/ModuleContext';
import { ROUTE_PATH } from '../../../../utils/route-util';
import { STORAGE_KEY } from '../../../../utils/storage-key';
import {
  applyBranchSwitch,
  filterBranchesByCompany,
  validateRequiredFields,
} from '../../use-cases';
const SideBarPage = () => {
  const {
    company,
    selectedCompany: selectedCompanyContext,
    user,
    fetchUser,
  } = useAuth();
  const { hasMainMenuPermission, hasMenuPermission } = useModulePermission();
  const location = useLocation();
  const pathName = location.pathname?.split('/dashboard/')[1];
  const [selectedCompany, setSelectdCompany] = useState('');
  const [optionBranch, setOptionBranch] = useState<SelectOption[]>([]);
  const [selectedBranch, setSelectdBranch] = useState('');
  const companyOptions = useMemo<CompanyBranchOption[]>(
    () =>
      (company ?? []).map((item) => ({
        label: item.companyName,
        value: item.companyCode,
        logo: item.companyLogo,
        branch: (item.branch ?? []).map((b) => ({
          label: b.branchName,
          value: b.branchCode,
        })),
      })),
    [company]
  );
  const funcButtonHandleClickExecute = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (validateRequiredFields([selectedCompany, selectedBranch])) {
      applyBranchSwitch(selectedCompany, selectedBranch);
      await fetchUser();
      closeModal();
    }
    e.preventDefault();
  };
  const companyHandleChange = (data: CompanyBranchOption | null) => {
    setSelectdCompany(data?.value ?? '');
    setOptionBranch(filterBranchesByCompany(companyOptions, data?.value ?? ''));
  };
  const branchHandleChange = (data: SelectOption | null) => {
    setSelectdBranch(data?.value ?? '');
  };
  const { modalRef, openModal, closeModal } = useModal();
  const operationShow = () => {
    let alt_fa_storage = localStorage.getItem(STORAGE_KEY) || '';
    let token_text = JSON.parse(alt_fa_storage);

    let companyDetails = company?.find(
      (item) => item.companyCode === token_text?.company
    );

    let BranchDetails = companyDetails?.branch?.find(
      (item) => item.branchCode === token_text?.branch
    );
    return (
      <div
        className="sm-d-none d-flex ps-2 cursor-pointer align-items-center justify-content-end"
        onClick={openModal}
      >
        <div style={{ marginRight: '10px' }} className="sidebar_company_logo">
          <img
            src={companyDetails?.companyLogoUrl}
            alt="company-logo"
            style={{ width: 120, height: 45, objectFit: 'contain' }}
          />
        </div>
        <div>
          <div className="mt-1 small text-muted">
            {companyDetails?.companyName}
          </div>
          <div
            className="mt-1 small text-muted line-clamp-1 sidebar_branch_name"
            title={BranchDetails?.branchName}
          >
            {BranchDetails?.branchName}
          </div>
        </div>
      </div>
    );
  };
  const userMenu = () => {
    return (
      <div>
        <div className="navbar-nav">
          {hasMainMenuPermission('mn9') && (
            <CustomNavItemLink
              to={ROUTE_PATH.dashboard}
              end
              label="Home"
              icon={<RxHome size={16} className="sidebar-nav-icon" />}
            />
          )}
          <>
            {hasMainMenuPermission('mn10') && (
              <div
                className={
                  pathName === 'project' ||
                  pathName === 'branch' ||
                  pathName === 'product' ||
                  pathName === 'user' ||
                  pathName === 'role-access' ||
                  pathName === 'data-entry'
                    ? 'nav-item dropdown active'
                    : 'nav-item dropdown'
                }
              >
                <Link
                  to={ROUTE_PATH.dashboard}
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-label="Open user menu"
                >
                  <span className="nav-link-icon d-none d-md-inline-block">
                    <TbSettings size={16} className="sidebar-nav-icon" />
                  </span>
                  <span className="nav-link-title">System setup</span>
                </Link>
                <div className="dropdown-menu dropdown-menu-start dropdown-menu">
                  <div className="dropdown-menu-rows">
                    {[
                      { label: 'Project', path: 'project', code: 'm9' },
                      { label: 'Branch', path: 'branch', code: 'm21' },
                      { label: 'Product', path: 'product', code: 'm22' },
                      { label: 'User', path: 'user', code: 'm10' },
                      {
                        label: 'Role access',
                        path: 'role-access',
                        code: 'm23',
                      },
                      { label: 'Data entry', path: 'data-entry', code: 'm24' },
                    ].map((menu) => {
                      return (
                        hasMenuPermission(menu.code) && (
                          <Link
                            key={menu.path}
                            className={
                              pathName === menu.path
                                ? 'dropdown-item active'
                                : 'dropdown-item'
                            }
                            to={`${ROUTE_PATH.dashboard}/${menu.path}`}
                          >
                            {menu.label}
                          </Link>
                        )
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            {hasMainMenuPermission('mn11') && (
              <div
                className={
                  pathName?.includes('customer/create') ||
                  pathName?.includes('customer/delete') ||
                  pathName?.includes('batch-register')
                    ? 'nav-item dropdown active'
                    : 'nav-item dropdown'
                }
              >
                <Link
                  to={ROUTE_PATH.dashboard}
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-label="Open user menu"
                >
                  <span className="nav-link-icon d-none d-md-inline-block">
                    <LuUserPlus size={16} className="sidebar-nav-icon" />
                  </span>
                  <span className="nav-link-title">Customer</span>
                </Link>
                <div className="dropdown-menu dropdown-menu-start dropdown-menu">
                  <div className="dropdown-menu-column">
                    {[
                      {
                        label: 'Register',
                        path: 'customer/create',
                        code: 'm12',
                      },
                      {
                        label: 'Batch register',
                        path: 'batch-register',
                        code: 'm13',
                      },
                      { label: 'Delete', path: 'customer/delete', code: 'm14' },
                    ].map((menu) => {
                      return (
                        hasMenuPermission(menu.code) && (
                          <Link
                            key={menu.path}
                            className={
                              pathName === menu.path
                                ? 'dropdown-item active'
                                : 'dropdown-item'
                            }
                            to={`${ROUTE_PATH.dashboard}/${menu.path}`}
                          >
                            {menu.label}
                          </Link>
                        )
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            {hasMainMenuPermission('mn13') && (
              <div
                className={
                  pathName === 'customer-report'
                    ? 'nav-item dropdown active'
                    : 'nav-item dropdown'
                }
              >
                <Link
                  to={ROUTE_PATH.dashboard}
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-label="Open user menu"
                >
                  <span className="nav-link-icon d-none d-md-inline-block">
                    <TbReport size={16} className="sidebar-nav-icon" />
                  </span>
                  <span className="nav-link-title">Report</span>
                </Link>
                <div className="dropdown-menu dropdown-menu-start dropdown-menu">
                  <div className="dropdown-menu-column">
                    {[
                      {
                        label: 'Customer Report',
                        path: 'customer-report',
                        code: 'm11',
                      },
                      {
                        label: 'User Report',
                        path: 'user-report',
                        code: 'm20',
                      },
                    ].map((menu) => {
                      return (
                        hasMenuPermission(menu.code) && (
                          <Link
                            key={menu.path}
                            className={
                              pathName === menu.path
                                ? 'dropdown-item active'
                                : 'dropdown-item'
                            }
                            to={`${ROUTE_PATH.dashboard}/${menu.path}`}
                          >
                            {menu.label}
                          </Link>
                        )
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        </div>
      </div>
    );
  };
  useEffect(() => {
    if (selectedCompanyContext) {
      const matched = companyOptions.find(
        (option) => option.value === selectedCompanyContext.companyCode
      );
      if (matched) companyHandleChange(matched);
    }
  }, [company]);
  if (!user) return null;
  return (
    <React.Fragment>
      <div className="sticky-top" style={{ top: '56px' }}>
        <div className="navbar-expand-sm">
          <div className="navbar-expand-sm">
            <div className="collapse navbar-collapse" id="navbar-menu">
              <div className="navbar navbar-light">
                <div className="container-xl">
                  {userMenu()}
                  <div className="my-2 my-md-0 my-0 flex-grow-1 flex-grow-0 flex-md-grow-0 ">
                    {operationShow()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal ref={modalRef} title={'Switch branch'}>
        <div className="mb-3">
          <label className="form-label required">Company</label>
          <Select
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={document.body}
            value={companyOptions.find(function (option) {
              return option.value === selectedCompany;
            })}
            onChange={companyHandleChange}
            options={companyOptions}
            required
          />
        </div>
        <div className="mb-2">
          <label className="form-label required">Branch</label>
          <Select
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={document.body}
            value={optionBranch.find(function (option) {
              return option.value === selectedBranch;
            })}
            onChange={branchHandleChange}
            options={optionBranch}
            required
          />
        </div>
        <div className="form-footer">
          <button
            type="submit"
            className="btn btn-primary w-100"
            onClick={funcButtonHandleClickExecute}
          >
            Switch branch
          </button>
        </div>
      </Modal>
    </React.Fragment>
  );
};
interface CustomNavItemLinkProps
  extends Omit<NavLinkProps, 'children' | 'to' | 'className'> {
  children?: React.ReactNode;
  icon: React.ReactNode;
  label: string;
  to: string;
  dropdown?: boolean;
}
const CustomNavItemLink = ({
  children,
  icon,
  label,
  to,
  dropdown,
  ...props
}: CustomNavItemLinkProps) => {
  return (
    <NavLink
      to={to}
      className={clsx('nav-link nav-item d-flex flex-row', { dropdown })}
      {...props}
    >
      <span className="nav-link-icon d-none d-md-inline-block">{icon}</span>
      <span className="nav-link-title">{label}</span>
      {children}
    </NavLink>
  );
};
export default SideBarPage;
