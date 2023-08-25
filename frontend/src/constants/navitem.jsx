import { UserAddOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { BiSolidDashboard } from 'react-icons/bi';
import { FaUserTie } from 'react-icons/fa';
import { AiFillProject } from 'react-icons/ai';
import { VscNewFolder } from 'react-icons/vsc';
import { BsListUl } from 'react-icons/bs';
import { MdAddTask, MdEditDocument } from 'react-icons/md';
import { GoTasklist, GoReport } from 'react-icons/go';
import { VscTasklist } from 'react-icons/vsc';
import { TbReportSearch } from 'react-icons/tb';

export const menuItems = [
  {
    label: 'Dashboard',
    key: '/',
    icon: <BiSolidDashboard />,
    desktop: 'true',
    is_member: 'true',
  },
  {
    label: 'Employee',
    icon: <FaUserTie />,
    desktop: 'true',
    children: [
      {
        label: 'New Employee',
        icon: <UserAddOutlined />,
        key: '/employee/add',
      },
      {
        label: 'Employee Lists',
        icon: <UsergroupAddOutlined />,
        key: '/employee/list',
      },
    ],
    is_member: 'false',
  },
  {
    label: 'Projects',
    icon: <AiFillProject />,
    desktop: 'true',
    children: [
      {
        label: 'New Project',
        icon: <VscNewFolder />,
        key: '/project/add',
      },
      {
        label: 'Project Lists',
        icon: <BsListUl />,
        key: '/project/list',
      },
    ],
    is_member: 'false',
  },
  {
    label: 'Tasks',
    icon: <VscTasklist />,
    desktop: 'true',
    children: [
      {
        label: 'New Task',
        icon: <MdAddTask />,
        key: '/task/add',
      },
      {
        label: 'Task Lists',
        icon: <GoTasklist />,
        key: '/task/list',
      },
    ],
    is_member: 'true',
  },
  {
    label: 'Reports',
    icon: <MdEditDocument />,
    desktop: 'true',
    children: [
      {
        label: 'New Report',
        icon: <GoReport />,
        key: '/report/add',
      },
      {
        label: 'Report Lists',
        icon: <TbReportSearch />,
        key: '/report/list',
      },
    ],
    is_member: 'true',
  },
];
