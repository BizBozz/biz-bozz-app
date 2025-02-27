import axios from "../axios";

export const deleteOrders = async (orderIds: string[]): Promise<void> => {
  try {
    const res = await axios.delete("api/v1/orders", {
      data: {
        ids: orderIds,
      },
    });

    console.log(res);
  } catch (error) {
    console.error("Error deleting orders:", error);
    throw error;
  }
};
