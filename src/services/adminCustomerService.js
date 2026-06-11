import axiosInstance from '../api/axiosInstance';

export const getCustomers = async ({
  tier,
  status,
  search,
  page = 1,
}) => {
  const { data } = await axiosInstance.get('/api/admin/customers', {
    params: {
      tier,
      status,
      search,
      page,
    },
  });

  return data;
};

export const getCustomerDetail = async (id) => {
  const { data } = await axiosInstance.get(
    `/api/admin/customers/${id}`
  );

  return data;
};

export const toggleLock = async (id) => {
  const { data } = await axiosInstance.patch(
    `/api/admin/customers/${id}/lock`
  );

  return data;
};