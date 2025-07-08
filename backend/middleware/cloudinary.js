import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import { models } from 'mongoose';
   // Configuration
    cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_API_SECERT
    });
    const uploadOnCloudinary=async(localFilePath)=>{
    try{
        if(!localFilePath)return null;
    const ressponse=await   cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        console.log("file is uploaded on cloudinar",ressponse.url);
        return ressponse

    }
    catch(error){
     fs.unlinkSync(localFilePath)// remove the locally saved temporary file as the upload operation go failde
      return null;;
    }

}
export {uploadOnCloudinary}

