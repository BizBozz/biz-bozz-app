import axios from "../axios";

export interface Dish {
  _id: string;
  name: string;
  price: number;
  categoryName: string;
  description?: string;
  image?: string;
}

export interface DishResponse {
  code: number;
  message: string;
  data: Dish[];
}

export const fetchDishes = async (): Promise<Dish[]> => {
  try {
    const response = await axios.get<DishResponse>("/api/v1/menu");
    console.log(response);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching dishes:", error);
    throw error;
  }
};
