import React, { useEffect } from 'react'
import './App.css'
import { Route, Routes, useNavigate } from 'react-router-dom'
import LoginPage from './components/pages/LoginPage.jsx'
import FogetPassword from './components/pages/ForgetPassword.jsx'
import Pagenotfound from './components/pages/Pagenotfound.jsx'
import Dashboard from './components/Admin/Dashboard.jsx'
import CreatePage from './components/Admin/CreateAdmin/CreatePage.jsx'
import BranchPage from './components/pages/CreatePages/BranchPage.jsx'
import HRPage from './components/pages/CreatePages/HRPage.jsx'
import ProjectPage from './components/pages/CreatePages/ProjectPage.jsx'
import RankPage from './components/pages/CreatePages/RankPage.jsx'
import CommissionPage from './components/pages/CreatePages/CommissionPage.jsx'
import BonanazaPage from './components/pages/CreatePages/BonanazaPage.jsx'
import GradePage from './components/pages/CreatePages/GradePage.jsx'
import AdvanceComm from './components/pages/CreatePages/AdvanceComm.jsx'
import BankPage from './components/pages/CreatePages/BankPage.jsx'
import TDSPage from './components/pages/CreatePages/TDSPage.jsx'
import AssociatePage from './components/pages/CreatePages/AssociatePage.jsx'
import { useDispatch } from 'react-redux'
import { userRank, AssociateDetails } from './store/counterSlice.js'
import axios from 'axios'
import CustomerPage from './components/pages/CreatePages/CustomerPage.jsx'
import PaymentAdmin from './components/Admin/CreateAdmin/PaymentAdmin.jsx'
import AdvancePayment from './components/pages/Paymentpage/AdvancePayment.jsx'
import AdvanceReport from './components/pages/Paymentpage/AdvanceReport.jsx'
import UserPage from './components/Admin/CreateAdmin/UserPage.jsx'
import CreateUser from './components/pages/UserPage/CreateUser.jsx'
import UserApproval from './components/pages/UserPage/UserApproval.jsx'
import RegistryAdmin from './components/Admin/CreateAdmin/RegistryAdmin.jsx'
import BranchDashboard from './components/pages/BranchPages/BranchDashboard.jsx'
import Member from './components/pages/BranchPages/CreatePages/Member.jsx'
import HrDashboared from './components/pages/HRpages/HrDashboared.jsx'
import Registration from './components/HR/Employee/Registraton.jsx'
import Attendence from './components/HR/Employee/Attendence.jsx'
import Leave from './components/HR/Employee/Leave.jsx'
import PaySalary from './components/HR/Payment/PaySalary.jsx'
import AddSalary from './components/HR/Payment/AddSalary.jsx'
import Salary from './components/HR/Duplicate/Salary.jsx'
import TerminatedEmployee from './components/HR/Reports/TerminatedEmployee.jsx'
import Associate from './components/pages/BranchPages/CreatePages/Associate.jsx'
import Customer from './components/pages/BranchPages/CreatePages/Customer.jsx'
import MemberPage from './components/pages/CreatePages/MemberPage.jsx'
import ExpencePage from './components/pages/CreatePages/ExpencePage.jsx'
import AddExpense from './components/pages/BranchPages/CreatePages/AddExpense.jsx'
import MonthlySalary from './components/HR/Reports/MonthlySalary.jsx'
import EmployeeList from './components/HR/Reports/EmployeeList.jsx'
import EMIPayment from './components/pages/BranchPages/PaymentPages/EMIPayment.jsx'
import PartPayment from './components/pages/BranchPages/PaymentPages/PartPayment.jsx'
import AssociateDashboard from './components/pages/Associatepages/AssociateDashboard.jsx'
import AssociateAdvance from './components/pages/BranchPages/PaymentPages/AssociateAdvance.jsx'
import AssociateLetter from './components/pages/BranchPages/PrintPages/AssociateLetter.jsx'
// import AssociatePrint from './components/Helper/BranchLetter/AssociatePrint.jsx'
import SelfChain from './components/pages/Associatepages/SelfChain.jsx'
import CustomerLetter from './components/pages/BranchPages/PrintPages/CustomerLetter.jsx'
import SelfAccount from './components/pages/Associatepages/SelfAccount.jsx'

// import SystemInfo from './components/pages/SystemInfo.jsx'

// Admin    
const App = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // const uid = sessionStorage.getItem('uid')
  // const pass = sessionStorage.getItem('pass')

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('token');
      if (!token || isTokenExpired(token)) {
        navigate('/');
      }
    };
    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000);
    return () => clearInterval(interval);
  }, [navigate]);

  const isTokenExpired = (token) => {
    const expiryDate = new Date(0);
    expiryDate.setUTCSeconds(JSON.parse(atob(token.split('.')[1])).exp);
    return expiryDate < new Date();
  };


  // fetch Associate Id
  const fetchAssociateId = async () => {
    try {
      const { data } = await axios.get('/api/v1/get-associate-id')
      if (data.success) {
        dispatch(AssociateDetails(data.result))
        // console.log(data.result)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  // access rank
  const fetchRankData = async () => {
    try {
      const response = await axios.get('/api/v1/get-rank');
      if (response.data.success) {
        dispatch(userRank(response.data.result))
      }
    } catch (error) {
      console.log('Error fetching rank data:', error);
    }
  };

  // useEffect hooks
  useEffect(() => {
    fetchRankData();
    fetchAssociateId()
  }, []);


  const userType = sessionStorage.getItem('userType');
  const status = sessionStorage.getItem('status');
  const combined = `${userType}-${status}`;

  switch (combined) {
    case 'Admin-0':
      return (
        <>
          <Routes>
            <Route path='/' exact element={<LoginPage />} />
            <Route path='*' element={<Pagenotfound />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/forget-password' element={<FogetPassword />} />
            {/* Create Page Routes */}
            <Route path='/create-page' element={<CreatePage />} />
            <Route path='/create-page/branch' element={<BranchPage />} />
            <Route path='/create-page/hr' element={<HRPage />} />
            <Route path='/create-page/project' element={<ProjectPage />} />
            <Route path='/create-page/rank' element={<RankPage />} />
            <Route path='/create-page/commission' element={<CommissionPage />} />
            <Route path='/create-page/bonanza' element={<BonanazaPage />} />
            <Route path='/create-page/grade' element={<GradePage />} />
            <Route path='/create-page/advance-commission' element={<AdvanceComm />} />
            <Route path='/create-page/bank' element={<BankPage />} />
            <Route path='/create-page/fine-tds' element={<TDSPage />} />
            <Route path='/create-page/associate' element={<AssociatePage />} />
            <Route path='/create-page/customer' element={<CustomerPage />} />
            <Route path='/create-page/member' element={<MemberPage />} />
            <Route path='/create-page/expence' element={<ExpencePage />} />

            {/* User Page Routes */}
            <Route path='/usr-page' element={<UserPage />} />
            <Route path='/usr-page/create-users' element={<CreateUser />} />
            <Route path='/usr-page/user-approval' element={<UserApproval />} />

            {/* Payment Page Routes */}
            <Route path='/payment-page' element={<PaymentAdmin />} />
            <Route path='/payment-page/advance-payment' element={<AdvancePayment />} />
            <Route path='/payment-page/advance-report' element={<AdvanceReport />} />

            {/* Registry Page Routes */}
            <Route path='/registry-page' element={<RegistryAdmin />} />
          </Routes>
        </>
      );

    case 'Branch-0':
      return (
        <>
          <Routes>
            <Route path='/' exact element={<LoginPage />} />
            <Route path='*' element={<Pagenotfound />} />
            <Route path='/forget-password' element={<FogetPassword />} />
            <Route path='/dashboard' exact element={<BranchDashboard />} />
            <Route path='/branch/create-member' element={<Member />} />
            <Route path='/branch/create-associate' element={<Associate />} />
            <Route path='/branch/create-customer' element={<Customer />} />
            <Route path='/branch/create-addexpence' element={<AddExpense />} />
            <Route path='/branch/emi-payment' element={<EMIPayment />} />
            <Route path='/branch/part-payment' element={<PartPayment />} />
            <Route path='/branch/associate-advance' element={<AssociateAdvance />}></Route>
            <Route path='/branch/associate-welcome-letter' element={<AssociateLetter />}></Route>
            <Route path='/branch/customer-welcome-letter' element={<CustomerLetter/>}></Route>
          </Routes>
        </>
      )
    case 'HR-0':
      return (
        <>
          <Routes>
            <Route path='/' exact element={<LoginPage />} />
            <Route path='/forget-password' element={<FogetPassword />} />
            <Route path='/dashboard' element={<HrDashboared />} />
            <Route path='/registration' element={<Registration />} />
            <Route path='/attendence' element={<Attendence />} />
            <Route path='/leave' element={<Leave />} />
            <Route path='/paysalary' element={<PaySalary />} />
            <Route path='/generatesalary' element={<AddSalary />} />
            <Route path='/duplicatesalary' element={<Salary />} />

            <Route path='/employeelist' element={<EmployeeList />} />
            <Route path='/monthlsalary' element={<MonthlySalary />} />
            <Route path='/termintedemployee' element={<TerminatedEmployee />} />
            <Route path='*' element={<Pagenotfound />} />
          </Routes>
        </>
      );

    case 'Associate-0':
      return(
        <>
        <Routes>
          <Route path='/' exact element={<LoginPage />} />
          <Route path='/forget-password' element={<FogetPassword />} />
          <Route path='/dashboard' element={<AssociateDashboard/>} /> 
          <Route path='/selfchain' element={<SelfChain/>} /> 
          <Route path='/selfaccount' element={<SelfAccount/>} /> 

          <Route path='*' element={<Pagenotfound />} />
        </Routes>
      </>
      )

    default:
      return <Routes><Route path='/*' element={<LoginPage />} /></Routes>;
  }

}
export default App