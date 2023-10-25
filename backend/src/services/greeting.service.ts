import { GreetingResponse } from "../interfaces/greeting.interface";

export const sayHelloService = async (): Promise<GreetingResponse> => {
  return { greeting: "Hello World 🌍! This API is working" };
};
