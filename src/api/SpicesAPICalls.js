import apis from "./Apis";

export const getAllSpices = async () => {
    try {
        const response = await apis.get("/spices");
        return response.data;
    } catch (error) {
        console.error("Error fetching members:", error);
        throw error;
    }
};