import axios from "./../axios";

interface PushMenuItemResponse {
  code: number;
  message: string;
  data?: any;
}

interface PushMenuItemRequest {
  // id: string;
  dishName: string;
  price: string;
}

export default async function pushMenuItem({
  id,
  dishName,
  price,
}: PushMenuItemRequest): Promise<PushMenuItemResponse> {
  console.log("Push menu item:", { id, dishName, price });
  try {
    const formData = new FormData();
    formData.append("dishName", dishName);
    formData.append("price", price);

    const response = await axios.patch(`api/v1/menu/items/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Push menu response:", response);

    return {
      code: response.status,
      message: response.data.message || "Success",
      data: response.data.data,
    };
  } catch (error: any) {
    console.error("Error pushing menu item:", error);
    return {
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to push menu item",
    };
  }
}
