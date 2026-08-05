import adminAxiosInstance from "../api/adminAxiosInstance";

export const getCustomers = async ({
  tier,
  status,
  search,
  page = 1,
  pageSize,
}) => {
  let isLocked = undefined;
  if (status === 'LOCKED') isLocked = true;
  else if (status === 'ACTIVE') isLocked = false;

  const { data } = await adminAxiosInstance.get('/admin/customers', {
    params: {
      tier: tier || undefined,
      isLocked,
      status: status || undefined,
      search: search || undefined,
      keyword: search || undefined,
      page,
      pageSize: pageSize || undefined,
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

export const updateNotes = async (id, notes) => {
  const { data } = await adminAxiosInstance.patch(
    `/admin/customers/${id}/notes`,
    { notes }
  );

  return data;
};