import adminAxiosInstance from "../api/adminAxiosInstance";

export const getCustomers = async ({
  tier,
  status,
  search,
  page = 1,
}) => {
  let isLocked = undefined;
  if (status === 'LOCKED') isLocked = true;
  else if (status === 'ACTIVE') isLocked = false;

  const { data } = await adminAxiosInstance.get('/admin/customers', {
    params: {
      tier: tier || undefined,
      isLocked,
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