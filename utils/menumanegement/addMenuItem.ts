import axios from "./../axios";

interface AddMenuItemResponse {
  code: number;
  message: string;
  data?: any;
}

interface AddMenuItemRequest {
  categoryName: string;
  dishName: string;
  price: string;
}

export default async function addMenuItem({
  categoryName,
  dishName,
  price,
}: AddMenuItemRequest): Promise<AddMenuItemResponse> {
  console.log(categoryName, dishName, price);
  try {
    const formData = new FormData();
    formData.append("categoryName", categoryName);
    formData.append("dishName", dishName);
    formData.append("price", price);

    const response = await axios.post("api/v1/menu/add-item", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("res", response);
    return {
      code: response.status,
      message: response.data.message || "Success",
      data: response.data.data,
    };
  } catch (error: any) {
    console.error("Error adding menu item:", error);
    return {
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to add menu item",
    };
  }
}
