import React, { useState } from "react";
import { Search, Eye, Edit2, Trash2, UserPlus, X } from "lucide-react";

const AdminUsers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for adding user
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = () => {
    if (
      !newUser.name ||
      !newUser.email ||
      !newUser.phone ||
      !newUser.password
    ) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
    console.log("New User:", newUser);
    setNewUser({
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "customer",
    });
    setShowAddModal(false);
  };

  const users = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      phone: "0912345678",
      role: "customer",
      orders: 12,
      points: 850,
      status: "active",
      joinDate: "01/01/2025",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@email.com",
      phone: "0987654321",
      role: "customer",
      orders: 8,
      points: 620,
      status: "active",
      joinDate: "15/01/2025",
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@email.com",
      phone: "0923456789",
      role: "customer",
      orders: 15,
      points: 1200,
      status: "active",
      joinDate: "20/02/2025",
    },
    {
      id: 4,
      name: "Admin Bảo An",
      email: "admin@baoan.vn",
      phone: "0901234567",
      role: "admin",
      orders: 0,
      points: 0,
      status: "active",
      joinDate: "01/01/2024",
    },
    {
      id: 5,
      name: "Phạm Thị D",
      email: "phamthid@email.com",
      phone: "0934567890",
      role: "customer",
      orders: 5,
      points: 350,
      status: "inactive",
      joinDate: "10/03/2025",
    },
  ];

  const roleOptions = [
    { value: "all", label: "Tất cả" },
    { value: "customer", label: "Khách hàng" },
    { value: "admin", label: "Quản trị viên" },
  ];

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === "all" || user.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-gray-900">Quản lý người dùng</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Thêm người dùng
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm người dùng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">
                    Họ tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">
                    SĐT
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">
                    Đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">
                    Điểm
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">#{user.id}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{user.name}</div>
                      <div className="text-xs text-gray-500">
                        Tham gia: {user.joinDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.phone}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.role === "admin" ? "Admin" : "Khách hàng"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{user.orders}</td>
                    <td className="px-6 py-4 text-sm text-cyan-600">
                      {user.points}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          user.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.status === "active"
                          ? "Hoạt động"
                          : "Không hoạt động"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button className="text-blue-600 hover:text-blue-700">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-700">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-2">Tổng người dùng</div>
            <div className="text-2xl text-gray-900">{users.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-2">Khách hàng</div>
            <div className="text-2xl text-blue-600">
              {users.filter((u) => u.role === "customer").length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-2">Hoạt động</div>
            <div className="text-2xl text-green-600">
              {users.filter((u) => u.status === "active").length}
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl text-gray-900">Thêm người dùng mới</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ tên *
                </label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  placeholder="VD: Nguyễn Văn A"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  placeholder="user@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleInputChange}
                  placeholder="0912345678"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu *
                </label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  placeholder="Nhập mật khẩu"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vai trò
                </label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="customer">Khách hàng</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleAddUser}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700"
              >
                Thêm người dùng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
