// import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Directory to store resumes
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//     console.log("Uploaded file:", req.file);

//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
// });

// export default upload;

import multer from "multer";
import path from "path";
import "../uploads"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/");
    // console.log("Saving file to uploads/ directory");
    // // Specify the directory where files will be stored
    // cb(null, "uploads/"); 
    console.log("Absolute path for uploads:", uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using timestamp and original name
    cb(null, `${Date.now()}-${file.originalname}`);
    console.log("Uploaded file:", req.file);
  },
});

// Multer configuration
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Set 5MB size limit
});

// Export the configured upload middleware
export default upload;
