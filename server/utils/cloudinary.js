import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudNary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfull
    // console.log("file is uploaded on cloudinary ", response.url);
    if (response) {
      fs.unlinkSync(localFilePath);
    }
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // r.emove the locally saved temporary file as the upload operation got failed
    // console.log(error.message);
    return null;
  }
};

export { uploadOnCloudNary };
