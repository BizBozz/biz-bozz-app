import axios from "./axios";
import { MenuResponse } from "@/types/menu";

// Generate code
const getItems = async (): Promise<MenuResponse> => {
  try {
    const res = await axios.get("api/v1/menu");
    // console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default getItems;
