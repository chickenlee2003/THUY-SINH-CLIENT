import { useEffect, useState } from "react";
import userService from "@/services/user.service";

interface User {
  id: number;
  name: string;
  email: string;
  // Add other user properties as needed
}

const UserProfile = ({ userId }: { userId: number }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userService.getUserById(userId);
        setUser(response.data);
      } catch (err) {
        setError("Failed to fetch user data");
        console.error("Failed to fetch user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>{user?.name}</h1>
      <p>Email: {user?.email}</p>
      {/* Render other user information as needed */}
    </div>
  );
};

export default UserProfile; 