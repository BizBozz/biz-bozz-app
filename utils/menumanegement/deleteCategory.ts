import axios from "../axios";

interface DeleteCategoryRequest {
  id: string;
  category: string;
}

interface DeleteCategoryResponse {
  code: number;
  message: string;
  data?: any;
}

const deleteCategory = async ({
  id,
  category,
}: DeleteCategoryRequest): Promise<DeleteCategoryResponse> => {
  const data = {
    category,
  };
  try {
    const response = await axios.delete(`api/v1/categories/list/${id}`, {
      data,
    });
    return response.data;
  } catch (error: any) {
    return {
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to delete category",
    };
  }
};

export default deleteCategory;
