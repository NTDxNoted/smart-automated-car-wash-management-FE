import adminAxiosInstance from "../api/adminAxiosInstance";

export const getCustomers = async ({
  tier,
  status,
  search,
  page = 1,
}) => {
  const { data } = await adminAxiosInstance.get('/admin/customers', {
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
  const { data } = await adminAxiosInstance.get(
    `/admin/customers/${id}`
  );

  return data;
};

export const toggleLock = async (id) => {
  const { data } = await adminAxiosInstance.patch(
    `/admin/customers/${id}/lock`
  );

  return data;
};