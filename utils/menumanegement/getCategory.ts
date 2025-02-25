import axios from "./../axios";
import { MenuResponse } from "@/types/menu";

// Generate code
const getCategory = async (): Promise<MenuResponse> => {
  try {
    const res = await axios.get("api/v1/categories");
    console.log(res);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default getCategory;
