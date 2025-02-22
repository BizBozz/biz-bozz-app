import axios from "./axios";

const handleSignIn = async (data: {
  phone_number: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`api/v1/auth/login`, data);
    console.log(response.data);
    return response.data;
  } catch (error) {}
};

export { handleSignIn };
