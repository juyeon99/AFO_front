import apis from "./Apis";

export const getAllPerfumes = async () => {
    try {
        const response = await apis.get("/perfumes");
        return response.data;
    } catch (error) {
        console.error("Error fetching perfumes:", error);
        throw error;
    }
};