import axios from "../axios";

interface AddCategoryResponse {
  code: number;
  message: string;
  data?: any;
}

interface AddCategoryRequest {
  categories: string[];
}

const addCategory = async (categoryName: string): Promise<AddCategoryResponse> => {
  try {
    const data: AddCategoryRequest = {
      categories: [categoryName],
    };

    const response = await axios.post("api/v1/categories/list", data);
    return response.data;
  } catch (error: any) {
    return {
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to add category",
    };
  }
};

export default addCategory;