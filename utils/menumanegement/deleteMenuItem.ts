import axios from "./../axios";

interface DeleteMenuItemResponse {
  code: number;
  message: string;
  data?: any;
}

export default async function deleteMenuItem(
  id: string
): Promise<DeleteMenuItemResponse> {
  console.log("Deleting menu item:", id);
  try {
    const response = await axios.delete(`api/v1/menu/items/${id}`);
    console.log("Delete menu item response:", response);

    return {
      code: response.status,
      message: response.data.message || "Success",
      data: response.data.data,
    };
  } catch (error: any) {
    console.error("Error deleting menu item:", error);
    return {
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to delete menu item",
    };
  }
}
