import React, { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface User {
  email: string;
  about_me: string | null;
  street_address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  birthdate: string | null;
}

const DataTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get<User[]>(`${backendUrl}/api/data`);
      setUsers(response.data);
    };

    fetchData();
  }, []);

  const formatDateToMMDDYYYY = (dateString: string) => {
    const date = new Date(dateString); 

    const month = String(date.getMonth() + 1).padStart(2, "0"); 
    const day = String(date.getDate() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}-${day}-${year}`; // Format as MM-DD-YYYY
};

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-xl w-[1000px] mx-auto">
      <table className="table-auto w-full text-lg text-left rtl:text-right">
        <thead className="text-xl uppercase bg-gray-200 border">
          <tr>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">About Me</th>
            <th className="px-6 py-3">Address</th>
            <th className="px-6 py-3">Birthdate</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr 
              key={user.email}
              className="border"
            >
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{user.about_me || "-"}</td>
              <td className="px-6 py-4">
                {user.street_address}, {user.city},{" "}
                {user.state}, {user.zip}
              </td >
              <td className="px-6 py-4">
                {user.birthdate ? formatDateToMMDDYYYY(user.birthdate) : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
