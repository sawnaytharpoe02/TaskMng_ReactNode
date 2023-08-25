import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import {
  Form,
  Input,
  DatePicker,
  Row,
  Col,
  Button,
  Select,
  Upload,
  Card,
  message,
  Modal,
  Checkbox,
  Spin,
} from 'antd';
import {
  RollbackOutlined,
  SaveOutlined,
  PlusOutlined,
  EditOutlined,
  UserAddOutlined,
  IdcardOutlined,
  UserOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import localeDate from 'dayjs/plugin/localeData';
import weeekday from 'dayjs/plugin/weekday';
import { employeeApi, notificationApi } from '../../services/apiServices';
import { VALIDATE, MESSAGE } from '../../constants/validate';
import { getUser, setUser } from '../../utils/storage';
import { useNetworkError } from '../../context/networkErrContext';
import UpdateUserContext from '../../context/updateUserContext';
import { socket } from '../../socket';
import './employeeCommon.scss';

dayjs.extend(weeekday);
dayjs.extend(localeDate);

const EmployeeCommon = () => {
  const { id } = useParams();
  const [userId, setUserId] = useState(id);
  const [pageName, setPageName] = useState(null);
  const [isUploadVisible, setIsUploadVisible] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [isEnableEditing, setIsEnableEditing] = useState(false);
  const [profileDisable, setProfileDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);
  const navigate = useNavigate();
  let { pathname } = useLocation();
  const [form] = Form.useForm();

  const { handleNetworkError } = useNetworkError();
  const { setUpdateUserContent } = useContext(UpdateUserContext);

  const userData = getUser();

  const positionOptions = [
    {
      value: 0,
      label: 'Admin',
    },
    {
      value: 1,
      label: 'Member',
    },
  ];

  //validation for employee user name length
  const validateName = (_, value) => {
    if (value && value.length <= 2) {
      return Promise.reject(new Error(MESSAGE.NAME_MAX_LENGTH_FORMAT));
    }
    return Promise.resolve();
  };

  // validation for phone number
  const validatePhone = (_, value) => {
    if (value && isNaN(value)) {
      return Promise.reject(new Error(MESSAGE.PHONE_INVALID_FORMAT));
    }
    if (value && value.length > 11) {
      return Promise.reject(new Error(MESSAGE.PHONE_MAX_LENGTH_FORMAT));
    }
    return Promise.resolve();
  };

  // Custom validation for date of birth
  const validateDOB = (_, currentDate) => {
    if (currentDate && currentDate.isAfter(dayjs().format('YYYY-MM-DD'), 'day')) {
      return Promise.reject('Cannot choose a future date');
    }
    return Promise.resolve();
  };

  const disabledDate = (currentDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to 00:00:00 to compare dates only
    return currentDate && currentDate.isAfter(today);
  };

  // upload img
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleCancel = () => setPreviewOpen(false);

  // Validation for upload file type
  const props = {
    beforeUpload: () => false,
    onChange: (info) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const isAllowedType = allowedTypes.includes(info.file.type);

      info ? setIsUploadVisible(false) : message.error(`"${info.file.name}" file upload failed.`);

      if (!isAllowedType) {
        form.setFieldsValue({
          profilePhoto: null,
        });
        setIsUploadVisible(true);
        message.error(
          `"${info.file.name}" is not a supported file type. Only JPG, PNG, and JPEG files are allowed.`
        );
      }

      return isAllowedType ? true : Upload.LIST_IGNORE;
    },
  };

  const handleEnableEditing = () => {
    setIsEnableEditing(!isEnableEditing);
    setProfileDisable(!profileDisable);
  };

  useEffect(() => {
    if (pathname.includes('add')) {
      setPageName('Add');
      setIsUploadVisible(true);
      form.resetFields();
    } else if (pathname.includes('edit')) {
      setPageName('Edit');
    } else if (pathname.includes('detail')) {
      setPageName('Detail');
    } else {
      setPageName('Profile');
    }
  }, [pathname]);

  const profileString =
    'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=740&t=st=1690357726~exp=1690358326~hmac=e49a4665f42b5c5e130073ee52b0338c64c78aae2025d7262989045151ae20d6';

  useEffect(() => {
    setIsFetchingDetail(true);
    if (userId) {
      employeeApi
        .getOne(userId)
        .then((res) => {
          const employeeDetail = res.data.result;

          let profilePhotoValue = null;
          if (employeeDetail.profilePhoto) {
            if (employeeDetail.profilePhoto !== profileString) {
              profilePhotoValue = [
                {
                  uid: '-1',
                  name: 'image',
                  status: 'done',
                  url: employeeDetail.profilePhoto,
                },
              ];
            } else {
              setIsUploadVisible(true);
              form.setFieldsValue({ profilePhoto: null });
            }
          }

          form.setFieldsValue({
            employeeName: employeeDetail.employeeName,
            email: employeeDetail.email,
            address: employeeDetail.address !== 'undefined' ? employeeDetail.address : undefined,
            phone: employeeDetail.phone !== 'null' ? employeeDetail.phone : null,
            dob: employeeDetail.dateOfBirth !== 'undefined' ? dayjs(employeeDetail.dateOfBirth) : '',
            position: employeeDetail.position,
            profilePhoto: profilePhotoValue,
          });
        })
        .catch((err) => {
          const message = err.response?.data?.message;
          if (message) {
            if (message) {
              navigate(`/404?status=404&subTitle=Employee%20Not%20Found`);
            }
          }
        })
        .finally(() => setIsFetchingDetail(false));

      setIsUploadVisible(!isUploadVisible);
    }
  }, [userId]);

  useEffect(() => {
    if (pageName === 'Profile') {
      const { _id: curr_userId } = userData;
      setUserId(curr_userId);
    }

    if (pageName === 'Add') {
      setIsFetchingDetail(false);
    }
  }, [pageName]);

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('employeeName', values.employeeName);
      formData.append('email', values.email);
      formData.append('address', values.address);
      formData.append('phone', values.phone || null);
      formData.append(
        'dateOfBirth',
        values.dob === '' ? 'undefined' : dayjs(values.dob).format('YYYY-MM-DD')
      );
      formData.append('position', values.position);

      if (values.profilePhoto) {
        if (values.profilePhoto[0].originFileObj) {
          formData.append('profilePhoto', values.profilePhoto[0].originFileObj);
        } else if (values.profilePhoto[0].url) {
          formData.append('profilePhoto', values.profilePhoto[0].url);
        } else {
          formData.append('profilePhoto', null);
        }
      } else {
        formData.append('profilePhoto', null);
      }

      form.setFieldsValue({ submitButtonDisabled: true });
      setLoading(true);
      const userData = getUser();

      const tag = 'EMPLOYEE';
      if (!userId) {
        const empResponse = await employeeApi.add(formData);
        message.success(empResponse.data?.message);

        const notiEmp = empResponse.data?.result;
        const notificationPayload = {
          tag,
          createdByWhom: userData._id,
          profile: userData?.profilePhoto,
          sendTo: '0',
          message: `
          Admin <span>${userData.employeeName}</span> has created a user account for <span class='created-user'>${notiEmp.employeeName}</span>
         `,
        };

        const notificationResponse = await notificationApi.add(notificationPayload);
        socket.emit('employeeCreated', notificationResponse.data?.result);
      } else {
        const empResponse = await employeeApi.update(userId, formData);
        if (userId === userData?._id) {
          employeeApi.getOne(userId).then((res) => {
            const emp = res.data?.result;
            setUser({
              ...values,
              _id: userData._id,
              profilePhoto: emp?.profilePhoto === profileString ? null : emp.profilePhoto,
            });
            setUpdateUserContent(true);
          });
        }
        message.success(empResponse.data?.message);

        const notiEmp = empResponse.data?.result;
        const notificationPayload = {
          tag,
          createdByWhom: userData._id,
          profile: userData?.profilePhoto,
          sendTo: '0',
          message: `
          Admin <span>${userData.employeeName}</span> made a update for <span class='created-user'>${notiEmp.employeeName}</span>
         `,
        };

        if (userId !== userData?._id) {
          const notificationResponse = await notificationApi.add(notificationPayload);
          socket.emit('employeeUpdated', notificationResponse.data?.result);
        }
      }

      userData?.position === 0 ? navigate('/employee/list') : navigate('/profile');
    } catch (err) {
      const res = err.response;
      message.error(res?.data.message);

      if (err?.code === 'ERR_NETWORK') {
        handleNetworkError();
      }
    } finally {
      setLoading(false);
      form.setFieldsValue({ submitButtonDisabled: false });
    }
  };

  return (
    <Row align="center">
      <Col xs={24} sm={24} md={20} lg={14} xl={12}>
        <Card
          className="my-form"
          title={
            <p style={{ fontSize: '1.1rem', textAlign: 'center' }}>
              {pageName === 'Add' && (
                <span>
                  <UserAddOutlined className="form-icon" />
                  Add New Employee
                </span>
              )}
              {pageName === 'Edit' && (
                <span>
                  <EditOutlined className="form-icon" />
                  Edit Employee
                </span>
              )}
              {pageName === 'Profile' && (
                <span>
                  <UserOutlined className="form-icon" />
                  Employee Profile
                </span>
              )}
              {pageName === 'Detail' && (
                <span>
                  <IdcardOutlined className="form-icon" />
                  Employee Detail
                </span>
              )}
            </p>
          }
        >
          <Form
            form={form}
            onFinish={onSubmit}
            labelAlign="left"
            layout="horizontal"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 17 }}
            disabled={pageName === 'Detail' || (profileDisable && pageName === 'Profile')}
            initialValues={{ position: 1 }}
          >
            {isFetchingDetail ? (
              <div
                style={{ minHeight: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <Spin />
              </div>
            ) : (
              <>
                <Form.Item
                  label={
                    <span>
                      Name
                      <span className="error-sign">*</span>
                    </span>
                  }
                  justify="space-between"
                  name="employeeName"
                  rules={[
                    { required: true, message: MESSAGE.EMPLOYEE_NAME_REQUIRED },
                    { validator: validateName },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label={
                    <span>
                      Email
                      <span className="error-sign">*</span>
                    </span>
                  }
                  justify="space-between"
                  name="email"
                  rules={[
                    { required: true, message: MESSAGE.EMAIL_REQUIRED },
                    { pattern: VALIDATE.EMAIL_REGEX, message: MESSAGE.EMAIL_INVALID_FORMAT },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="profilePhoto"
                  label={<span>Profile Photo</span>}
                  justify="space-between"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                >
                  <Upload
                    listType="picture-card"
                    maxCount="1"
                    onPreview={handlePreview}
                    onRemove={() => {
                      setIsUploadVisible(!isUploadVisible);
                      form.setFieldsValue({ profilePhoto: null });
                    }}
                    {...props}
                  >
                    {isUploadVisible && (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                  <img
                    alt="profile_photo"
                    style={{
                      width: '100%',
                    }}
                    src={previewImage}
                  />
                </Modal>
                <Form.Item label={<span>Address</span>} justify="space-between" name="address">
                  <Input.TextArea />
                </Form.Item>

                <Form.Item
                  label={
                    <span>
                      Phone
                      <span className="error-sign">*</span>
                    </span>
                  }
                  justify="space-between"
                  name="phone"
                  rules={[{ required: true, message: MESSAGE.PHONE_REQUIRED }, { validator: validatePhone }]}
                >
                  <Input style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  label={<span>DOB</span>}
                  justify="space-between"
                  name="dob"
                  rules={[{ validator: validateDOB }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder="yyyy-mm-dd"
                    disabledDate={disabledDate}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span>
                      Position
                      <span className="error-sign">*</span>
                    </span>
                  }
                  justify="space-between"
                  name="position"
                >
                  <Select
                    width="100%"
                    options={
                      userData?.position !== 0
                        ? positionOptions.map((status) => ({ ...status, disabled: true }))
                        : positionOptions
                    }
                  ></Select>
                </Form.Item>

                {pageName === 'Profile' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <Link to="/change-password">Change password ?</Link>
                    <div>
                      <Checkbox
                        onChange={handleEnableEditing}
                        checked={isEnableEditing}
                        disabled={false}
                        id="enableEditing"
                      ></Checkbox>
                      <label
                        htmlFor="enableEditing"
                        style={{ marginLeft: '5px', color: '#1677ff', cursor: 'pointer' }}
                      >
                        Enable Editing
                      </label>
                    </div>
                  </div>
                )}

                <Row
                  gutter={[16, 16]}
                  style={{ flexDirection: pageName === 'Detail' ? 'row-reverse' : 'row' }}
                >
                  <Col xs={24} sm={12} md={12}>
                    <Button
                      disabled={false}
                      className="custom-danger-btn"
                      block
                      icon={<RollbackOutlined />}
                      onClick={() => navigate(-1)}
                    >
                      {pageName === 'Detail' ? 'Back' : 'Cancel'}
                    </Button>
                  </Col>

                  <Col xs={24} sm={12} md={12}>
                    {pageName === 'Add' && (
                      <Button
                        className="custom-primary-btn"
                        htmlType="submit"
                        loading={loading}
                        block
                        icon={<SaveOutlined />}
                        disabled={form.getFieldValue('submitButtonDisabled')}
                      >
                        Save
                      </Button>
                    )}
                    {(pageName === 'Edit' || pageName === 'Profile') && (
                      <Button
                        className="custom-primary-btn"
                        htmlType="submit"
                        loading={loading}
                        block
                        icon={<EditOutlined />}
                        disabled={form.getFieldValue('submitButtonDisabled')}
                      >
                        Edit
                      </Button>
                    )}
                  </Col>
                </Row>
              </>
            )}
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default EmployeeCommon;
