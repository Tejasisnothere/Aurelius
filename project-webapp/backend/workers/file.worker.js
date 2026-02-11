import File from "../models/fileModel.js";

export const processFiles = async (fileId, fileUrl) => {
    try {
        await File.findByIdAndUpdate(fileId, {
            status: "processing"
        })
    } catch (error) {
        
    }
};