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
// import { fileURLToPath } from "url";
// import path from "path";

// // Define __dirname for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, "../uploads/");
//     // console.log("Saving file to uploads/ directory");
//     // // Specify the directory where files will be stored
//     // cb(null, "uploads/"); 
//     console.log("Absolute path for uploads:", uploadPath);
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     // Generate a unique filename using timestamp and original name
//     cb(null, `${Date.now()}-${file.originalname}`);
//     console.log("Uploaded file:", req.file);
//   },
// });

// // Multer configuration
// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // Set 5MB size limit
// });

// // Export the configured upload middleware
// export default upload;


// import multer from "multer";
// import { GridFsStorage } from "multer-gridfs-storage";

// // MongoDB URI
// const mongoURI = process.env.MONGO_CONNECTION;

// // GridFS Storage
// const storage = new GridFsStorage({
//   url: mongoURI,
//   options: { useUnifiedTopology: true },
//   file: (req, file) => {
//     const match = ["application/pdf"]; // Accept only PDF files

//     if (match.indexOf(file.mimetype) === -1) {
//       return `${Date.now()}-file-${file.originalname}`;
//     }

//     return {
//       bucketName: "uploads", // Bucket to store files (default is `fs`)
//       filename: `${Date.now()}-${file.originalname}`, // Custom filename
//     };
//   },
// });

// const upload = multer({ storage });

// export default upload;

import { GridFsStorage } from "multer-gridfs-storage";
import multer from "multer";

// MongoDB URI
const mongoURI = process.env.MONGO_CONNECTION;

// GridFS Storage
const storage = new GridFsStorage({
  url: mongoURI,
  options: { useUnifiedTopology: true }, // Add this to avoid warnings
  file: (req, file) => {
    const match = ["application/pdf"]; // Accept only PDF files

    if (match.indexOf(file.mimetype) === -1) {
      return null; // Reject unsupported files
    }

    return {
      bucketName: "uploads", // Ensure this matches your GridFS bucket
      filename: `${Date.now()}-${file.originalname}`, // Generate unique filename
    };
  },
});

const upload = multer({ storage });

export default upload;
