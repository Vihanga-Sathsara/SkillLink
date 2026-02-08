export const uploadImageToCloudinary = async (imageUri: string, fileName: string) => {
    const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    try{
        const formData = new FormData()
        formData.append("file", {
          uri: imageUri,
          type: "image/jpeg",
          name:  fileName
        } as any)
      
        if (uploadPreset) {
          formData.append("upload_preset", uploadPreset)
        }

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json()
        if (data.secure_url) {
          return data.secure_url
        }else{
            throw new Error("Failed to upload image to Cloudinary")
        }

     }catch(error){
        console.error("Image Upload Error: ", error)
        throw error
     }
}

export const uploadPDFToCloudinary = async (fileUri: string, fileName: string) => {
    const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    try{
        const formData = new FormData()
        formData.append("file", {
          uri: fileUri,
          type: "application/pdf",
          name:  fileName
        } as any)
      
        if (uploadPreset) {
          formData.append("upload_preset", uploadPreset)
        }

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json()
        if (data.secure_url) {
          return data.secure_url
        }else{
            throw new Error("Failed to upload PDF to Cloudinary")
        }

     }catch(error){
        console.error("Image Upload Error: ", error)
        throw error
     }
}
