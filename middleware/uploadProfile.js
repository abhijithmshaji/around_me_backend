import multer from "multer";
import path from "path";

// Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile"); // create uploads/profile folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File Validation
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png"];
  allowed.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

export const uploadProfile = multer({ storage, fileFilter });
