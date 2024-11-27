import apis from "./Apis";

export const getAllSpices = async () => {
    try {
        const response = await apis.get("/spices");
        console.log("API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching spices:", error);
        throw error;
    }
};