// const USE_MOCK_DATA = true;

// const ADMIN_ACCOUNTS = [
//   {
//     adminId: "ADM-001",
//     fullName: "System Admin",
//     phone: "0903557940",
//     password: "admin123",
//     role: "Admin",
//   },
// ];

// const delay = (ms = 600) =>
//   new Promise((resolve) => setTimeout(resolve, ms));

// const mockToken = (adminId) => `admin.${btoa(adminId)}.token`;

// export async function adminLogin({ phone, password }) {
//   await delay(500);

//   const admin = ADMIN_ACCOUNTS.find(
//     (item) => item.phone === phone
//   );

//   if (!admin || admin.password !== password) {
//     throw new Error("INVALID_ADMIN");
//   }

//   return {
//     token: mockToken(admin.adminId),
//     adminId: admin.adminId,
//     fullName: admin.fullName,
//     role: "Admin",
//   };
// }

// export function adminLogout() {
//   localStorage.removeItem("admin_token");
// }

import adminAxiosInstance from "../api/adminAxiosInstance";

export async function adminLogin({ phone, password }) {
  const res = await adminAxiosInstance.post("/api/admin/auth/login", {
    phone,
    password,
  });

  const data = res.data;

  const token = data.token || data.accessToken || data.jwtToken;

  if (token) {
    localStorage.setItem("admin_token", token);
  }

  localStorage.setItem("admin_user", JSON.stringify(data));

  return data;
}

export function adminLogout() {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
}