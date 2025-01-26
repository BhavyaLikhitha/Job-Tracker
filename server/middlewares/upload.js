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

// import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Specify the directory where files will be stored
//     cb(null, "uploads/"); 
//   },
//   filename: (req, file, cb) => {
//     // Generate a unique filename using timestamp and original name
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// // Multer configuration
// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // Set 5MB size limit
// });

// // Export the configured upload middleware
// export default upload;
import multer from "multer";
import path from "path";

// Configure Multer for local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve("uploads"); // Resolve to absolute path
    cb(null, uploadPath); // Specify the directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

export default upload;
