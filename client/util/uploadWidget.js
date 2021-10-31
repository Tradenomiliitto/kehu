import { getText } from "./ApiUtil";
import { toQueryString } from "./TextUtil";

/**
 *
 * @param {string} publicId  - Public name of the image. If a image with same name already exists it
 *                             is overwritten (permission to overwrite is checked in the backend
 *                             cloudinary-signature function)
 * @param {string} language  - Language of the upload widget
 * @param {function} cb(url) - Callback to call after image upload. `url` is either string to public
 *                             url of the uploaded image or null if upload failed
 */
export function uploadWidget(publicId, language, cb) {
  cloudinary.openUploadWidget(
    {
      cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
      uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
      apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY,
      cropping: true,
      croppingAspectRatio: 1,
      showSkipCropButton: false,
      //croppingCoordinatesMode: 'face', // signature generation not working for some reason when using face mode
      multiple: false,
      publicId,
      uploadSignature: generateSignature,
      language,
      styles: {
        palette: {
          window: "#FFFFFF",
          windowBorder: "#CFCFCF",
          tabIcon: "#FF96AC",
          menuIcons: "#5A616A",
          textDark: "#000000",
          textLight: "#FFFFFF",
          link: "#FF96AC",
          action: "#FF96AC",
          inactiveTabIcon: "#3B5F5F",
          error: "#ff5f83",
          inProgress: "#0078FF",
          complete: "#DBFFE5",
          sourceBg: "#EDF1F1",
        },
      },
    },
    (error, result) => {
      // Call cb with picture url if succesfull update, otherwise call with null
      if (!error && result && result.event === "success") {
        return cb(result.info.secure_url);
      }
      return cb(null);
    }
  );
}

async function generateSignature(callback, params_to_sign) {
  const path = "/profiili/cloudinary-signature?";
  const params = toQueryString({ data: params_to_sign });
  const signature = await getText(encodeURI(path + params));
  callback(signature);
}
