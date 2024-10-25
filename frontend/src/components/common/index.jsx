import React from "react";
import { FaSms } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaSquareWhatsapp } from "react-icons/fa6";
import { SiCivicrm } from "react-icons/si";
import { AiFillDashboard } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { FiPrinter } from "react-icons/fi";
import { BsLayoutTextWindow, BsSearch } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { AiTwotoneDelete } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { IoPrint } from "react-icons/io5";
export const menuItem = [
    { name: 'SMS', icon: <FaSms /> },
    { name: 'Email', icon: <MdOutlineMailOutline /> },
    { name: 'Whatsapp', icon: <FaSquareWhatsapp /> },
    { name: 'CRM', icon: <SiCivicrm /> },
]

export const AdminMenuList = [
    { name: 'Dashboard', icon: <AiFillDashboard />, value: 'Dashboard', to: '/dashboard' },
    { name: 'Create', icon: <FaPlus />, value: 'Create', to: '/create-page' },
    { name: 'User', icon: <FaPlus />, value: 'User', to: '/usr-page' },
    { name: 'Payment', icon: <MdOutlinePayment />, value: 'Payment', to: '/payment-page' },
    { name: 'Duplicate', icon: <FiPrinter />, value: 'Duplicate', },
    { name: 'Registry', icon: <MdOutlinePayment />, value: 'Registry', to: '/registry-page' },
    { name: 'Vouchar', icon: <MdOutlinePayment />, value: 'Vouchar', },
    { name: 'Complete Reports', icon: <BsLayoutTextWindow />, value: 'Complete Reports', },
    { name: 'Branch Reports', icon: <BsLayoutTextWindow />, value: 'Branch Reports' },
    { name: 'Collection Point Reports', icon: <BsLayoutTextWindow />, value: 'Collection Point Reports' },
    { name: 'Setting', icon: <IoSettingsOutline />, value: 'Setting' },
    { name: 'Add Gallery', icon: <IoSettingsOutline />, value: 'Add Gallery' },
]

// Create page png img
import branch from '../../assets/createmenu/branch.png'
import hr from '../../assets/createmenu/hr.png'
import project from '../../assets/createmenu/project.png'
import rank from '../../assets/createmenu/rank.png'
import commiss from '../../assets/createmenu/commiss.png'
import TDS from '../../assets/createmenu/TDS.png'
import Bonos from '../../assets/createmenu/Bonos.png'
import bank from '../../assets/createmenu/bank.png'
import cust from '../../assets/createmenu/cust.png'
import assos from '../../assets/createmenu/assos.png'
import spot from '../../assets/payment/spotcomm.jpg'
import user from '../../assets/createmenu/42.png'
import approve from '../../assets/createmenu/Approved-Stamp-Icon.png'
import member from '../../assets/createmenu/MemberIcon.png'
import expence from '../../assets/createmenu/head.jpg'


export const createPageMenu = [
    { id: 1, name: 'Branch', value: 'Branch', src: branch, to: '/create-page/branch' },
    { id: 2, name: 'HR', value: 'HR', src: hr, to: '/create-page/hr' },
    { id: 3, name: 'Project', value: 'Project', src: project, to: '/create-page/project' },
    { id: 4, name: 'Rank', value: 'Rank', src: rank, to: '/create-page/rank' },
    { id: 5, name: 'Commission', value: 'Commission', src: commiss, to: '/create-page/commission' },
    { id: 6, name: 'Advance Commission', value: 'Advance Commission', src: commiss, to: '/create-page/advance-commission' },
    { id: 7, name: 'Grade', value: 'Grade', src: commiss, to: '/create-page/grade' },
    { id: 8, name: 'Set late Fine & TDS', value: 'Set late Fine & TDS', src: TDS, to: '/create-page/fine-tds' },
    { id: 9, name: 'Bonanza', value: 'Bonanza', src: Bonos, to: '/create-page/bonanza' },
    { id: 10, name: 'Bank', value: 'Bank', src: bank, to: '/create-page/bank' },
    { id: 1, name: 'Associate', value: 'Associate', src: cust, to: '/create-page/associate' },
    { id: 12, name: 'Customer', value: 'Customer', src: assos, to: '/create-page/customer' },
    { id: 13, name: 'Member', value: 'Member', src: member, to: '/create-page/member' },
    { id: 14, name: 'Expence', value: 'Expence', src: expence, to: '/create-page/expence' },
]

export const paymentPageMenu = [
    { Id: 1, name: 'Advance Payment', value: 'Advance Payment', src: spot, to: '/payment-page/advance-payment' },
    { Id: 1, name: 'Datewise Advance Report', value: 'Datewise Advance Report', src: spot, to: '/payment-page/advance-report' },
]

export const createUser = [
    { Id: 1, name: 'Create User', value: 'Create User', src: user, to: '/usr-page/create-users' },
    { Id: 1, name: 'User Approval', value: 'User Approval', src: approve, to: '/usr-page/user-approval' },
]

// Sup name
export const supName = [
    { Id: 1, name: 'S/O', value: 'S/O' },
    { Id: 2, name: 'D/O', value: 'D/O' },
    { Id: 3, name: 'W/O', value: 'W/O' },
]
// Sup name
export const ProRefer = [
    { Id: 1, name: 'Normal', value: 'Normal' },
    { Id: 2, name: 'Corner', value: 'Corner' },
    { Id: 3, name: 'Park Facing', value: 'Park Facing' },
    { Id: 4, name: '30Fit Road', value: '30Fit Road' },
]
// payment type
export const PaymentType = [
    { Id: 1, name: 'EMI Payment Plan', value: 'EMI Payment Plan' },
    { Id: 2, name: 'Full Payment Plan', value: 'Full Payment Plan' },
    { Id: 3, name: 'Part Payment Plan', value: 'Part Payment Plan' },
]
// category
export const category = [
    { Id: 1, name: 'General', value: 'General' },
    { Id: 2, name: 'OBC', value: 'OBC' },
    { Id: 3, name: 'SC', value: 'SC' },
    { Id: 4, name: 'ST', value: 'ST' },
    { Id: 5, name: 'Other', value: 'Other' },
]

// plot size
export const plotSize = []
for (let size = 35; size <= 560; size++) {
    plotSize.push(size)
}



// branch Menu List

export const branchMenu = [
    { name: 'Dashboard', icon: <AiFillDashboard />, value: 'Dashboard', to: '/dashboard' },
    {
        name: 'Create', icon: <FaPlus />, value: 'Create', to: '', children: [
            { id: 1, name: 'Member', value: 'Member', src: branch, to: '/branch/create-member' },
            { id: 2, name: 'Associate', value: 'Associate', src: hr, to: '/branch/create-associate' },
            { id: 3, name: 'Customer', value: 'Customer', src: project, to: '/branch/create-customer' },
            { id: 4, name: 'Add Expense', value: 'Add Expense', src: rank, to: '/branch/create-addexpence' },
        ]
    },
    {
        name: 'Payment', icon: <MdOutlinePayment />, value: 'Payment', to: '', children: [
            { id: 1, name: 'EMI Payment', value: 'EMI Payment', src: branch, to: '/branch/emi-payment' },
            { id: 2, name: 'Part Payment', value: 'Part Payment', src: hr, to: '/branch/part-payment' },
            { id: 3, name: 'Associate Advance', value: 'Associate Advance', src: project, to: '/branch/associate-advance' },
            { id: 4, name: 'Spot Commission', value: 'Spot Commission', src: rank, to: '' },
        ]
    },
    {
        name: 'Print', icon: <IoPrint />, value: 'Print', to: '',
        children: [
            { id: 1, name: 'Associate Welcome Letter', value: 'Associate Welcome Letter', src: branch, to: '/branch/associate-welcome-letter' },
            { id: 2, name: 'Customer Welcome Letter', value: 'Customer Welcome Letter', src: hr, to: '/branch/customer-welcome-letter' },
            { id: 3, name: 'Customer Allotment Letter', value: 'Customer Allotment Letter', src: project, to: '' },
            { id: 4, name: 'Customer', value: 'Customer', src: rank, to: '/branch/associate-print-letter' },
            { id: 5, name: 'Renewal', value: 'Renewal', src: rank, to: '' },
            { id: 6, name: 'Pending Renewal', value: 'Pending Renewal', src: rank, to: '' },
        ]
    },
    {
        name: 'Duplicate', icon: <FiPrinter />, value: 'Duplicate',
        children: [
            { id: 1, name: 'Agreement Form', value: 'Agreement Form', src: branch, to: '' },
            { id: 2, name: 'Customer', value: 'Customer', src: hr, to: '' },
            { id: 3, name: 'Pending Customer', value: 'Pending Customer', src: project, to: '' },
            { id: 4, name: 'Customer Mobile No', value: 'Customer Mobile No', src: hr, to: '' },
            { id: 5, name: 'Agent KYC', value: 'Agent KYC', src: commiss, to: '' },
            { id: 6, name: 'Member', value: 'Member', src: commiss, to: '' },
        ]
    },
    // { name: 'Registry', icon: <MdOutlinePayment />, value: 'Registry', to: '/registry-page' },
    { name: 'Vouchar', icon: <MdOutlinePayment />, value: 'Vouchar', },
    {
        name: 'Felds Reports', icon: <BsLayoutTextWindow />, value: 'Felds Reports',
        children: [
            { id: 1, name: 'Collection Point', value: 'Collection Point', src: branch, to: '' },
            { id: 2, name: 'Customer', value: 'Customer', src: hr, to: '' },
            { id: 3, name: 'Associate Mobile No', value: 'Associate Mobile No', src: project, to: '' },
            { id: 4, name: 'Single Renewal', value: 'Single Renewal', src: rank, to: '' },
            { id: 5, name: 'Bulk Renewal', value: 'Bulk Renewal', src: commiss, to: '' },
            { id: 6, name: 'Spot Commission', value: 'Spot Commission', src: commiss, to: '' },
        ]
    },
    { name: 'Official Reports', icon: <BsLayoutTextWindow />, value: 'Official Reports' },
    // { name: 'Collection Point Reports', icon: <BsLayoutTextWindow />, value: 'Collection Point Reports' },
    { name: 'Setting', icon: <IoSettingsOutline />, value: 'Setting' },
    { name: 'Add Gallery', icon: <IoSettingsOutline />, value: 'Add Gallery' },
]

export const hrMenu = [
    { name: 'Dashboard', icon: <AiFillDashboard />, value: 'Dashboard', to: '/dashboard' },
    {
        name: 'Emoloyee', icon: <FaPlus />, value: 'Employee', to: '', children: [
            { id: 1, name: 'Registration', value: 'Registration', to: '/registration' },
            { id: 2, name: 'Attendence', value: 'Attendence', to: '/attendence' },
            { id: 3, name: 'Leave', value: 'Leave', src: project, to: '/leave' },
            // { id: 4, name: 'Add Expense', value: 'Add Expense', src: rank, to: '/create-page/rank' },
        ]
    },
    {
        name: 'Payment', icon: <MdOutlinePayment />, value: 'Payment', to: '', children: [
            { id: 1, name: 'Generate Salary', value: 'Generate Payment', to: '/generatesalary' },
            { id: 2, name: 'Pay Salary', value: 'Pay Payment', to: '/paysalary' },
        ]
    },
    {
        name: 'Duplicate', icon: <FiPrinter />, value: 'Duplicate',
        children: [
            { id: 1, name: 'Salary', value: 'Salary', src: branch, to: '/duplicatesalary' },
        ]
    },
    {
        name: 'Reports', icon: <BsLayoutTextWindow />, value: 'Felds Reports',
        children: [
            { id: 1, name: 'Employee List', value: 'Employee List', to: '/employeelist' },
            { id: 2, name: 'Monthly Salary', value: 'Monthly Salary', to: '/monthlsalary' },
            { id: 3, name: 'Terminated Employee', value: 'Terminated Employee', to: '/termintedemployee' },
        ]
    },
    {
        name: 'Search', icon: <BsSearch />, value: 'Official Reports',
        children: [
            { id: 1, name: 'Emploee List', value: 'Collection Point', src: branch, to: '' },
            { id: 2, name: 'ID wise Employee List', value: 'Customer', src: hr, to: '' },
            { id: 3, name: 'Department wise Employee List', value: 'Department wise Employee List', src: project, to: '' },
            { id: 3, name: 'Designation wise Employee List', value: 'Designation wise Employee List', src: project, to: '' },
        ]
    },
]

export const associateMenu = [
    { name: 'Dashboard', icon: <AiFillDashboard />, value: 'Dashboard', to: '/dashboard' },

    {
        name: 'Self Chain', icon: <FaPlus />, value: 'Self Chain', to: '/selfchain',
        children: [
        ]
    },
    {
        name: 'Self Account', icon: <MdOutlinePayment />, value: 'Self Account', to: '/selfaccount',
        children: [
        ]
    },
    {
        name: 'Self Business', icon: <FiPrinter />, value: 'Self Business',
        children: [
        ]
    },
    {
        name: 'Team Business', icon: <BsLayoutTextWindow />, value: 'Team Business',
        children: [
        ]
    },
    {
        name: 'Self Due Collection', icon: <BsSearch />, value: 'Self Due Collection',
        children: [
        ]
    },
    {
        name: 'Team Due Collection', icon: <BsSearch />, value: 'Team Due Collection',
        children: [
        ]
    },
    {
        name: 'Self Payment List', icon: <BsSearch />, value: 'Self Payment List',
        children: [
        ]
    },
    {
        name: 'Vehicle Request', icon: <BsSearch />, value: 'Vehicle Request',
        children: [

        ]
    },

]