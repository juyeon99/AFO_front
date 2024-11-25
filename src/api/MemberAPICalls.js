import apis from "./Apis";

export const getAllMembers = async () => {
    try {
        const response = await apis.get("/members");
        return response.data;
    } catch (error) {
        console.error("Error fetching members:", error);
        throw error;
    }
};