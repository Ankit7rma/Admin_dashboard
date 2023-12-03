"use client";
import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
}

const Home: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRows, setSelectedRows] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      const data: User[] = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    Object.values(user).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleSelectAll = () => {
    if (selectedRows.length === itemsPerPage) {
      setSelectedRows([]);
    } else {
      setSelectedRows(
        filteredUsers.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        )
      );
    }
  };

  const handleDeleteSelected = () => {
    const updatedUsers = users.filter((user) => !selectedRows.includes(user));
    setUsers(updatedUsers);
    setSelectedRows([]);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const totalPages: number = Math.ceil(filteredUsers.length / itemsPerPage);
  const visibleUsers: User[] = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-skyblue">
      <div className="w-full max-w-4xl p-8 bg-white rounded-md shadow-lg">
        <div className="header mb-4">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
          <button
            className="search-icon ml-2 px-4 py-2 bg-blue-500 text-black rounded-md"
            onClick={handleSearch}
          >
            🔍
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={selectedRows.length === itemsPerPage}
                  onChange={handleSelectAll}
                />
              </th>
              <th>ID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(user)}
                    onChange={() => {
                      const updatedSelection = selectedRows.includes(user)
                        ? selectedRows.filter(
                            (selectedUser) => selectedUser !== user
                          )
                        : [...selectedRows, user];
                      setSelectedRows(updatedSelection);
                    }}
                  />
                </td>
                <td className="text-black">{user.id}</td>
                <td className="text-black">{user.name}</td>
                <td>
                  <button
                    className="delete px-4 py-2 bg-red-500 text-white rounded-md"
                    onClick={() => {
                      const updatedUsers = users.filter(
                        (currentUser) => currentUser !== user
                      );
                      setUsers(updatedUsers);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination mt-4">
          <button
            className="first-page px-4 py-2 bg-red-300 rounded-md mr-2"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            First
          </button>
          <button
            className="previous-page px-4 py-2 bg-red-300 rounded-md mr-2"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="next-page px-4 py-2 bg-red-300 rounded-md ml-2"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button
            className="last-page px-4 py-2 bg-red-300 rounded-md ml-2"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div>
        <button
          className="delete-selected mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
          onClick={handleDeleteSelected}
        >
          Delete Selected
        </button>
      </div>
    </div>
  );
};

export default Home;
