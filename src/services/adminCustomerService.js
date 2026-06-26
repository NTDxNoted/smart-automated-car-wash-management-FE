import axiosInstance from '../api/axiosInstance';

const adminAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
  },
});

adminAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

adminAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
    }

    return Promise.reject(error);
  }
);

export const getCustomers = async ({
  tier,
  status,
  search,
  page = 1,
}) => {
  const { data } = await adminAxiosInstance.get('/api/admin/customers', {
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
    `/api/admin/customers/${id}`
  );

  return data;
};

export const toggleLock = async (id) => {
  const { data } = await adminAxiosInstance.patch(
    `/api/admin/customers/${id}/lock`
  );

  return data;
};