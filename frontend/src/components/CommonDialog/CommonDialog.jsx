import { Modal, message } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import { notificationApi } from '../../services/apiServices';
import { getUser } from '../../utils/storage';
import { socket } from '../../socket';

const { confirm } = Modal;

const showDeleteConfirm = async (name, api, method, id, updatedData, listsToFilter, handleShowModal) => {
  const modal = confirm({
    title: `Are you sure you want to delete this ${name}?`,
    icon: <ExclamationCircleFilled />,
    content: 'This action cannot be undone.',
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    centered: true,
    okButtonProps: { loading: false },
    onOk: async () => {
      modal.update({ okButtonProps: { loading: true } });

      const isFound = listsToFilter?.filter(
        (list) => list[`${name === 'project' ? 'project' : 'employee'}`]?._id === id
      );

      if (isFound.length > 0) {
        modal.destroy();
        return handleShowModal(true);
      } else {
        try {
          const res = await api[method](id);

          let temp = 1;
          const fetchRes = await api.getAll();
          const updatedItems = fetchRes.data.result.map((item) => ({
            ...item,
            key: item._id,
            id: temp++,
            ...(name === 'project'
              ? {
                  description: item.description || '-',
                  startDate: dayjs(item.startDate).format('YYYY-MM-DD'),
                  endDate: dayjs(item.endDate).format('YYYY-MM-DD'),
                }
              : {
                  phone: item.phone !== 'null' ? item.phone : '-',
                  address: item.address !== 'undefined' ? item.address : '-',
                  dob: item.dateOfBirth !== 'undefined' ? dayjs(item.dateOfBirth).format('YYYY-MM-DD') : '-',
                  position: item.position === 0 ? 'Admin' : 'Member',
                }),
          }));

          updatedData(updatedItems);
          message.success(res.data?.message);

          // notification part
          const userData = getUser();
          const tag = name.toUpperCase();

          const notify = res.data?.result;
          const notificationPayload = {
            tag,
            createdByWhom: userData._id,
            profile: userData?.profilePhoto,
            sendTo: '0',
            message: `
          Admin <span>${userData.employeeName}</span> deleted a ${
              name !== 'project' ? 'user account' : 'project'
            } <span class='created-user'>${
              name !== 'project' ? notify.employeeName : notify.projectName
            }</span>
         `,
          };

          const notificationResponse = await notificationApi.add(notificationPayload);
          socket.emit(
            name !== 'project' ? 'employeeDeleted' : 'projectDeleted',
            notificationResponse.data?.result
          );
        } catch (error) {
          const { data } = error.response;
          message.error(data?.message);
        } finally {
          modal.update({ okButtonProps: { loading: false } });
          modal.destroy();
        }
      }
    },
    onCancel() {},
  });
};

export default showDeleteConfirm;
