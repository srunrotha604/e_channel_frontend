import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from '../components/common/PrivateRoute';
import { useAuth } from '../context/AuthContext';
import Layout from '../layouts';
import { ROUTE_PATH } from '../utils/route-util';
const DevelopmentPage = lazy(
  () => import('../domains/development/ui/pages/index')
);
const Login = lazy(() => import('../domains/default/ui/pages/LoginPage'));
const HomePage = lazy(() => import('../domains/default/ui/pages/HomePage'));
const LogoutPage = lazy(() => import('../domains/default/ui/pages/LogoutPage'));
const Error404Page = lazy(
  () => import('../domains/default/ui/pages/Error404Page')
);
const Error500Page = lazy(
  () => import('../domains/default/ui/pages/Error500Page')
);
const ProjectPage = lazy(
  () => import('../domains/project-configuration/ui/pages/ProjectPage')
);
const BranchPage = lazy(
  () => import('../domains/project-configuration/ui/pages/BranchPage')
);
const ProductPage = lazy(
  () => import('../domains/project-configuration/ui/pages/ProductPage')
);
const UserPage = lazy(
  () => import('../domains/system-users/ui/pages/UserPage')
);
const RoleAccessPage = lazy(
  () => import('../domains/system-users/ui/pages/RoleAccessPage')
);
const DataEntryPage = lazy(
  () => import('../domains/system-users/ui/pages/DataEntryPage')
);
const ForgotPasswordPage = lazy(
  () => import('../domains/default/ui/pages/ForgotPasswordPage')
);
const ProjectCreatePage = lazy(
  () => import('../domains/project-configuration/ui/pages/ProjectCreatePage')
);
const ProjectEditPage = lazy(
  () => import('../domains/project-configuration/ui/pages/ProjectEditPage')
);
const ProjectPolicyPage = lazy(
  () => import('../domains/project-configuration/ui/pages/ProjectPolicyPage')
);
const ProjectPolicyCreatePage = lazy(
  () =>
    import('../domains/project-configuration/ui/pages/ProjectPolicyCreatePage')
);
const BranchCreatePage = lazy(
  () => import('../domains/project-configuration/ui/pages/BranchCreatePage')
);
const BranchProjectPage = lazy(
  () => import('../domains/project-configuration/ui/pages/BranchProjectPage')
);
const BranchProjectCreatePage = lazy(
  () =>
    import('../domains/project-configuration/ui/pages/BranchProjectCreatePage')
);
const BranchProjectEditPage = lazy(
  () =>
    import('../domains/project-configuration/ui/pages/BranchProjectEditPage')
);
const UserCreatePage = lazy(
  () => import('../domains/system-users/ui/pages/UserCreatePage')
);
const UserEditPage = lazy(
  () => import('../domains/system-users/ui/pages/UserEditPage')
);
const UserRolePage = lazy(
  () => import('../domains/system-users/ui/pages/UserRolePage')
);
const UserRoleCreatePage = lazy(
  () => import('../domains/system-users/ui/pages/UserRoleCreatePage')
);
const CompanyForm = lazy(
  () => import('../domains/system-users/ui/pages/CompanyForm')
);
const BranchForm = lazy(
  () => import('../domains/system-users/ui/pages/BranchForm')
);
const UserAccessBranchPage = lazy(
  () => import('../domains/system-users/ui/pages/UserAccessBranchPage')
);
const UserAccessStatusPage = lazy(
  () => import('../domains/system-users/ui/pages/UserAccessStatusPage')
);
const DataEntryCreatePage = lazy(
  () => import('../domains/system-users/ui/pages/DataEntryCreatePage')
);
const DataEntryImportPage = lazy(
  () => import('../domains/system-users/ui/pages/DataEntryImportPage')
);
const ProductCreatePage = lazy(
  () => import('../domains/project-configuration/ui/pages/ProductCreatePage')
);
const ProductEditPage = lazy(
  () => import('../domains/project-configuration/ui/pages/ProductEditPage')
);
const InsuranceProductPage = lazy(
  () => import('../domains/customer/ui/pages/InsuranceProductPage')
);
const CustomerPage = lazy(
  () => import('../domains/customer/ui/pages/CustomerPage')
);
const CustomerCreatePage = lazy(
  () => import('../domains/customer/ui/pages/CustomerCreatePage')
);
const CustomerEditPage = lazy(
  () => import('../domains/customer/ui/pages/CustomerEditPage')
);
const CustomerDeletePage = lazy(
  () => import('../domains/customer/ui/pages/CustomerDeletePage')
);
const CustomerTransationDetailPage = lazy(
  () => import('../domains/customer/ui/pages/CustomerTransationDetailPage')
);
const BatchRegisterPage = lazy(
  () => import('../domains/batch/ui/pages/BatchRegisterPage')
);
const BatchDetailPage = lazy(
  () => import('../domains/batch/ui/pages/BatchDetailPage')
);
const VersionHandlePage = lazy(
  () => import('../domains/version-history/ui/pages/VersionHistoryPage')
);
const CustomerReportPage = lazy(
  () => import('../domains/reports/ui/pages/CustomerReportPage')
);
const UserReportPage = lazy(
  () => import('../domains/reports/ui/pages/UserReportPage')
);
const ProfilePage = lazy(
  () => import('../domains/default/ui/pages/ProfilePage')
);
const ChangePasswordPage = lazy(
  () => import('../domains/default/ui/pages/ChangePasswordPage')
);
const SwitchBranchPage = lazy(
  () => import('../domains/default/ui/pages/SwitchBranchPage')
);
const ContactUsPage = lazy(
  () => import('../domains/default/ui/pages/ContactUsPage')
);
const LoginListLog = lazy(
  () => import('../domains/logs-list/ui/pages/LoginListPage')
);
export default function AllRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="full-height-container"></div>;
  }

  return (
    <Routes>
      <Route
        path={ROUTE_PATH.root}
        element={user ? <Layout /> : <Navigate to={ROUTE_PATH.login} />}
      >
        <Route path={ROUTE_PATH.root} element={<HomePage />} />
        <Route path={ROUTE_PATH.dashboard} element={<HomePage />} />
        <Route path={ROUTE_PATH.loginList} element={<LoginListLog />} />
        <Route path={ROUTE_PATH.logout} element={<LogoutPage />} />
        <Route path={ROUTE_PATH.project} element={<ProjectPage />} />
        <Route path={ROUTE_PATH.branch} element={<BranchPage />} />
        <Route path={ROUTE_PATH.product} element={<ProductPage />} />
        <Route path={ROUTE_PATH.user} element={<UserPage />} />
        <Route path={ROUTE_PATH.roleAccess} element={<RoleAccessPage />} />
        <Route path={ROUTE_PATH.dataEntry} element={<DataEntryPage />} />
        <Route
          path={ROUTE_PATH.projectCreate}
          element={<ProjectCreatePage />}
        />
        <Route path={ROUTE_PATH.development} element={<DevelopmentPage />} />
        <Route
          path={ROUTE_PATH.projectEdit(':key')}
          element={<ProjectEditPage />}
        />
        <Route
          path={ROUTE_PATH.projectPolicy(':key')}
          element={<ProjectPolicyPage />}
        />
        <Route
          path={ROUTE_PATH.projectPolicyCreate(':key')}
          element={<ProjectPolicyCreatePage />}
        />
        <Route path={ROUTE_PATH.branchCreate} element={<BranchCreatePage />} />
        <Route
          path={ROUTE_PATH.branchProject(':key')}
          element={<BranchProjectPage />}
        />
        <Route
          path={ROUTE_PATH.branchProjectCreate(':key')}
          element={<BranchProjectCreatePage />}
        />
        <Route
          path={ROUTE_PATH.branchProjectEdit(':key')}
          element={<BranchProjectEditPage />}
        />
        <Route path={ROUTE_PATH.userCreate} element={<UserCreatePage />} />
        <Route path={ROUTE_PATH.userEdit(':key')} element={<UserEditPage />} />
        <Route path={ROUTE_PATH.userRole(':key')} element={<UserRolePage />} />
        <Route
          path={ROUTE_PATH.userRoleCreate(':key')}
          element={<UserRoleCreatePage />}
        />
        <Route path={ROUTE_PATH.userCompany} element={<CompanyForm />} />
        <Route path={ROUTE_PATH.userCompanyBranch} element={<BranchForm />} />
        <Route
          path={ROUTE_PATH.userAccessBranch(
            ':applicationId',
            ':companyCode',
            ':userCode'
          )}
          element={<UserAccessBranchPage />}
        />
        <Route
          path={ROUTE_PATH.userAccessStatus(':userCode')}
          element={<UserAccessStatusPage />}
        />
        <Route
          path={ROUTE_PATH.dataEntryCreate}
          element={<DataEntryCreatePage />}
        />
        <Route
          path={ROUTE_PATH.dataEntryImport}
          element={<DataEntryImportPage />}
        />
        <Route
          path={ROUTE_PATH.productCreate}
          element={<ProductCreatePage />}
        />
        <Route
          path={ROUTE_PATH.productEdit(':key')}
          element={<ProductEditPage />}
        />
        <Route
          path={ROUTE_PATH.customerCreate}
          element={<InsuranceProductPage />}
        />
        <Route path={ROUTE_PATH.customer(':key')} element={<CustomerPage />} />
        <Route
          path={ROUTE_PATH.customerCreateWithProduct(':key')}
          element={<CustomerCreatePage />}
        />
        <Route
          path={ROUTE_PATH.customerEdit(':key', ':productCode')}
          element={<CustomerEditPage />}
        />
        <Route
          path={ROUTE_PATH.customerDelete}
          element={<CustomerDeletePage />}
        />
        <Route
          path={ROUTE_PATH.customerTransaction(':key')}
          element={<CustomerTransationDetailPage />}
        />
        <Route
          path={ROUTE_PATH.batchRegister}
          element={<BatchRegisterPage />}
        />
        <Route
          path={ROUTE_PATH.customerBatch(':key')}
          element={<BatchDetailPage />}
        />
        <Route path={ROUTE_PATH.version} element={<VersionHandlePage />} />
        <Route
          path={ROUTE_PATH.customerReport}
          element={<CustomerReportPage />}
        />
        <Route path={ROUTE_PATH.userReport} element={<UserReportPage />} />
        <Route path={ROUTE_PATH.profile} element={<ProfilePage />} />
        <Route
          path={ROUTE_PATH.changePassword}
          element={<ChangePasswordPage />}
        />
        <Route path={ROUTE_PATH.switchBranch} element={<SwitchBranchPage />} />
        <Route path={ROUTE_PATH.contactUs} element={<ContactUsPage />} />
      </Route>
      <Route path={ROUTE_PATH.error404} element={<Error404Page />} />
      <Route path={ROUTE_PATH.error500} element={<Error500Page />} />
      <Route
        path={ROUTE_PATH.forgotPassword}
        element={<ForgotPasswordPage />}
      />
      <Route
        path={ROUTE_PATH.login}
        element={
          user ? (
            <Navigate to={ROUTE_PATH.root} />
          ) : (
            <PrivateRoute auth={true} redirect="/dashboard">
              <Login />
            </PrivateRoute>
          )
        }
      />
    </Routes>
  );
}
