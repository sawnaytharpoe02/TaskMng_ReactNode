import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import {
  Row,
  Col,
  Menu,
  Button,
  Drawer,
  Tooltip,
  Empty,
  Popover,
  Avatar,
  Space,
  message,
  Badge,
  Modal,
} from 'antd';
import { BellOutlined, MenuOutlined, LogoutOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { GrClose } from 'react-icons/gr';
import { GoTasklist, GoReport } from 'react-icons/go';
import { BsClockHistory } from 'react-icons/bs';
import { socket } from '../../socket';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import authService from '../../services/authServices';
import { notificationApi } from '../../services/apiServices';
import { menuItems } from '../../constants/navitem';
import { getUser, removeToken, removeUser } from '../../utils/storage';
import MenuContext from '../../context/menuContext';
import VerifyContext from '../../context/verifyContext';
import Logo from '/logo.png';
import './navbar.scss';
import UpdateUserContext from '../../context/updateUserContext';
import { useNetworkError } from '../../context/networkErrContext';

dayjs.extend(relativeTime);

const Navbar = () => {
  const { currentMenuItem, setCurrentMenuItem } = useContext(MenuContext);
  const { verifyEmail } = useContext(VerifyContext);
  const [openNav, setOpenNav] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [filterNotificationData, setFilterNotificationData] = useState([]);
  const [notificationBadgeCount, setNotificationBadgeCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { updateUserContent, setUpdateUserContent } = useContext(UpdateUserContext);
  const { handleNetworkError } = useNetworkError();

  const handleSelectedMenu = (e) => {
    setCurrentMenuItem(e.key);
    navigate(e.key);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      const res = await authService.logout();
      removeToken();
      removeUser();
      message.success(res.data?.message);
      navigate('/login');
    } catch (error) {
      const { data } = error.response;
      if (data?.status === 500) {
        navigate('/login');
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleNavClose = () => {
    setOpenNav(false);
  };

  useEffect(() => {
    setCurrentMenuItem(pathname);
    handleNavClose();
  }, [pathname, setCurrentMenuItem, currentMenuItem]);

  const handleEditNotification = async (id) => {
    try {
      setFilterNotificationData((prevFilterNotificationData) =>
        prevFilterNotificationData.filter((notification) => notification._id !== id)
      );

      setNotificationBadgeCount((prevCount) => Math.max(prevCount - 1, 0));
      await notificationApi.update(id, { read: currentUser._id });
    } catch (error) {
      const { data } = error.response;
      message.error(data?.message);

      if (error?.code === 'ERR_NETWORK') {
        handleNetworkError();
      }
    }
  };

  const fetchAllNotifications = async () => {
    try {
      const loginUser = await getUser();
      const res = await notificationApi.getAll();
      const allNotifications = res.data?.result || [];

      const filteredNotifications = allNotifications.filter((row) => {
        if (
          row.tag === 'REPORT' &&
          row.createdByWhom !== loginUser?._id &&
          row.sendTo === loginUser?._id &&
          !row.read.includes(loginUser?._id)
        ) {
          return true;
        }
        if (
          row.tag === 'TASK' &&
          !row.read.includes(loginUser?._id) &&
          row.createdByWhom !== loginUser?._id
        ) {
          return loginUser?.position === 0 || row.sendTo === loginUser?._id;
        }
        if (
          row.tag === 'EMPLOYEE' &&
          row.createdByWhom !== loginUser?._id &&
          row.sendTo === loginUser?.position.toString() &&
          !row.read.includes(loginUser?._id)
        ) {
          return true;
        }
        if (
          row.tag === 'PROJECT' &&
          row.createdByWhom !== loginUser?._id &&
          row.sendTo === loginUser?.position.toString() &&
          !row.read.includes(loginUser?._id)
        ) {
          return true;
        }
        return false;
      });

      setFilterNotificationData(filteredNotifications);
      setNotificationBadgeCount(filteredNotifications?.length);
    } catch (error) {
      const { data } = error.response;
      message.error(data?.message);

      if (error?.code === 'ERR_NETWORK') {
        handleNetworkError();
      }
    }
  };

  useEffect(() => {
    const eventNames = [
      'createReportNotifications',
      'createTaskNotifications',
      'updateTaskNotifications',
      'createEmployeeNotifications',
      'updateEmployeeNotifications',
      'deleteEmployeeNotifications',
      'createProjectNotifications',
      'updateProjectNotifications',
      'deleteProjectNotifications',
    ];

    const handleCreateNotifications = async () => {
      await fetchAllNotifications();
    };

    eventNames.forEach((eventName) => {
      socket.on(eventName, handleCreateNotifications);
    });

    return () => {
      eventNames.forEach((eventName) => {
        socket.off(eventName, handleCreateNotifications);
      });
    };
  }, []);

  useEffect(() => {
    if (window.performance.navigation.type === window.performance.navigation.TYPE_RELOAD) {
      fetchAllNotifications();
    }

    window.addEventListener('resize', handleNavClose);
    return () => {
      window.removeEventListener('resize', handleNavClose);
    };
  }, []);

  useEffect(() => {
    fetchAllNotifications();
    const user = getUser();
    user?.position === 1 ? setIsAuthenticated(false) : setIsAuthenticated(true);
  }, [pathname]);

  useEffect(() => {
    if (updateUserContent) {
      setUpdateUserContent(false);
    }
    setCurrentUser(getUser());
  }, [pathname, updateUserContent]);

  const unAuthenticatedMenuItems = menuItems.filter((item) => item.is_member === 'true');

  const content = (
    <div className="popover-content">
      {filterNotificationData.length > 0 ? (
        filterNotificationData.map((notification) => (
          <div
            key={uuidv4()}
            className="notification-item"
            onClick={() => handleEditNotification(notification?._id)}
          >
            <div className="tag">{notification?.tag}</div>

            <div className="notification-content">
              <Avatar size="large" src={notification?.profile} style={{ marginRight: '.2rem' }} />
              <div className="text-blk" dangerouslySetInnerHTML={{ __html: notification?.message }} />
            </div>
            <p className="created-at">
              <BsClockHistory />
              {dayjs(notification?.createdAt).fromNow()}
            </p>
          </div>
        ))
      ) : (
        <Empty description="No Notifications" style={{ marginTop: '2.2rem' }} />
      )}
    </div>
  );
  return (
    <>
      <Row className="navigation_bar">
        <Col xs={14} sm={8} md={6} lg={6} xl={4}>
          <Link to="/" style={{ color: '#002329' }}>
            <div style={{ display: 'flex', gap: '.6rem' }}>
              <img src={Logo} alt="logo" width="40px" height="40px" />
              <p>
                Task Management <br /> System
              </p>
            </div>
          </Link>
        </Col>
        {!verifyEmail && currentUser && (
          <>
            <Col xs={0} sm={0} md={10} lg={10} xl={14}>
              <Menu
                className="menu_items"
                onClick={handleSelectedMenu}
                selectedKeys={[currentMenuItem]}
                mode="horizontal"
                items={isAuthenticated ? menuItems : unAuthenticatedMenuItems}
                style={{ backgroundColor: 'transparent' }}
              />
            </Col>
            <Col xs={10} sm={16} md={8} lg={8} xl={6}>
              <div className="nav_btn_gps">
                <div className="admin_profile_btn">
                  <Tooltip placement="bottom" title={currentUser?.position !== 0 ? 'Member' : 'Admin'}>
                    <Button onClick={() => navigate('/profile')}>
                      {(currentUser?.employeeName || '').slice(0, 5) +
                        (currentUser?.employeeName.length > 5 ? '..' : '')}
                    </Button>
                  </Tooltip>
                </div>
                <div className="noti_btn">
                  <Badge count={notificationBadgeCount} overflowCount={99} style={{ marginRight: '5px' }}>
                    <Popover placement="bottomRight" content={content} trigger="click">
                      <Button icon={<BellOutlined />}></Button>
                    </Popover>
                  </Badge>
                </div>
                <div className="logout_btn">
                  <Button
                    icon={<LogoutOutlined style={{ fontSize: '1rem' }} />}
                    onClick={() => setOpenLogoutModal(true)}
                  >
                    Log Out
                  </Button>
                </div>
                <div>
                  <Button className="hamburger_menu" onClick={() => setOpenNav(true)}>
                    <MenuOutlined />
                  </Button>
                </div>
              </div>
            </Col>
          </>
        )}

        <Modal
          centered
          width={350}
          open={openLogoutModal}
          title={<span style={{ fontWeight: '600' }}>Are you sure to Log Out ?</span>}
          style={{ textAlign: 'center' }}
          onCancel={() => setOpenLogoutModal(false)}
          footer={[
            <Button key="back" className="custom-primary-btn" onClick={() => setOpenLogoutModal(false)}>
              NO
            </Button>,
            <Button
              key="return"
              className="custom-danger-btn"
              loading={isLoggingOut}
              onClick={() => {
                handleLogout();
                setOpenLogoutModal(false);
              }}
            >
              YES
            </Button>,
          ]}
          closable={false}
        >
          <div style={{ fontSize: '30px', color: '#ef233c' }}>
            <QuestionCircleOutlined />
          </div>
          <p style={{ fontSize: '14px' }}>Logging out will securely sign you out of your account.</p>
        </Modal>

        <Drawer
          title={<span style={{ marginLeft: '.6rem' }}>Task Management System</span>}
          placement="right"
          onClose={handleNavClose}
          open={openNav}
          extra={<GrClose style={{ cursor: 'pointer' }} onClick={handleNavClose} />}
          className="nav_menu_drawer"
        >
          <Link to="/profile">
            <Space style={{ margin: '0 15px 20px 20px', cursor: 'pointer' }}>
              <Avatar shape="square" size={64} src={currentUser?.profilePhoto} />
              <p style={{ fontSize: '.9rem', marginLeft: '.75rem' }}>{currentUser?.employeeName}</p>
            </Space>
          </Link>
          <Menu
            onClick={handleSelectedMenu}
            selectedKeys={[currentMenuItem]}
            mode="inline"
            items={isAuthenticated ? menuItems : unAuthenticatedMenuItems}
            style={{ width: '100%' }}
          />
          <Button
            style={{ margin: '.8rem auto 0', width: '90%', display: 'block' }}
            icon={<LogoutOutlined />}
            onClick={() => setOpenLogoutModal(true)}
          >
            Log out
          </Button>
        </Drawer>
      </Row>
    </>
  );
};

export default Navbar;
