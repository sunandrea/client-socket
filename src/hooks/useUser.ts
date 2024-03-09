import { useState, useEffect } from "react";

interface User {
  _id: string;
  email: string;
  name: string;
  lastName: string;
  phone: string;
  isGoogle: boolean;
  isConfirmed: boolean;
  __v: number;
}

function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/stage/api/auth/me")
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error(error));
  }, []);

  return user;
}

export default useUser;
