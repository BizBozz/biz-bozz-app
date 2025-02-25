import axios from "../axios";

interface PushCategoriesRequest {
  id: string;
  categories: string;
}

interface PushCategoriesResponse {
  code: number;
  message: string;
  data?: any;
}

const pushCategories = async (
  data: PushCategoriesRequest
): Promise<PushCategoriesResponse> => {
  try {
    const response = await axios.post(`api/v1/categories/list/${data.id}`, {
      categories: [data.categories],
    });

    return response.data;
  } catch (error: any) {
    return {
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to add category",
    };
  }
};

export default pushCategories;
