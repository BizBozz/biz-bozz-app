import axios from "./axios";

const handleSignIn = async (data: {
  phone_number: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`api/v1/auth/login`, data);
    // console.log(response.data);
    return response;
  } catch (error) {
    return error;
  }
};

const handleSignUp = async (data: {
  phone_number: string;
  password: string;
  confirm_password: string;
  shopName: string;
  shopType: string;
}) => {
  try {
    const response = await axios.post(`api/v1/auth/signup`, data);
    // console.log(response.data);
    return response;
  } catch (error) {
    return error;
  }
};

export { handleSignIn, handleSignUp };
