const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { promisify } = require("util");
const Applications = require("../db/Application");
const pipeline = promisify(require("stream").pipeline);

const router = express.Router();

const upload = multer();

router.post("/uploadCV", async (req, res) => {
  const { userId, recruiterId, jobId, sop, resumeUrl } = req.body; // Extract data from request body

  const applicationData = {
    userId: '666b1a408485c943a4acedb6',
    recruiterId: '666b1a588485c943a4acedb8',
    jobId: jobId,
    status: 'applied', // Default status
    sop,
    resume: resumeUrl
  };

  try {
    const newApplication = await Applications.create(applicationData);

    // console.log("New application inserted:", newApplication);
    
    res.status(201).json({ message: "Application inserted successfully" });
  } catch (error) {
    console.error("Error inserting application:", error);
    res.status(500).json({ message: "Error inserting application" });
  }
});

// router.post("/uploadCV", async (req, res) => {
//   const { resumeUrl } = req.body; // Thay vì const { imageData } = req;
//   // console.log(resumeUrl); // Log resumeUrl thay vì imageData
//   const newApplicationData = {
//     status: 'accepted',
//     _id: '665ec2a41f46368699d943dd',
//     userId: '665ebf5b1f46368699d943a3',
//     recruiterId: '665ec2581f46368699d943a9',
//     jobId: '665ec2851f46368699d943ab',
//     sop: 'Em yeu cong ty',
//     dateOfApplication: '2024-06-04T07:30:44.288Z',
//     __v: 0,
//     dateOfJoining: '2024-06-04T07:31:29.920Z',
//     resume: resumeUrl
//   };

//   try {
//     // Chèn dữ liệu vào bảng 'applications' bằng phương thức create()
//     const newApplication = await Applications.create(newApplicationData);

//     console.log("New application inserted:", newApplication);
    
//     // Lấy danh sách các bản ghi từ bảng 'applications' sau khi chèn
//     // const applications = await Applications.find();
//     // console.log("All applications:", applications);
    
//     res.status(201).json({ message: "Application inserted successfully" });
//   } catch (error) {
//     console.error("Error inserting application:", error);
//     res.status(500).json({ message: "Error inserting application" });
//   }
// });

// router.post("/resume", upload.single("file"), (req, res) => {
//   const { file } = req;
//   if (file.detectedFileExtension != ".pdf") {
//     res.status(400).json({
//       message: "Invalid format",
//     });
//   } else {
//     const filename = `${uuidv4()}${file.detectedFileExtension}`;

//     pipeline(
//       file.stream,
//       fs.createWriteStream(`${__dirname}/../public/resume/${filename}`)
//     )
//       .then(() => {
//         res.send({
//           message: "File uploaded successfully",
//           url: `/host/resume/${filename}`,
//         });
//       })
//       .catch((err) => {
//         res.status(400).json({
//           message: "Error while uploading",
//         });
//       });
//   }
// });

router.post("/profile", upload.single("file"), (req, res) => {
  const { file } = req;
  if (
    file.detectedFileExtension != ".jpg" &&
    file.detectedFileExtension != ".png"
  ) {
    res.status(400).json({
      message: "Invalid format",
    });
  } else {
    const filename = `${uuidv4()}${file.detectedFileExtension}`;

    pipeline(
      file.stream,
      fs.createWriteStream(`${__dirname}/../public/profile/${filename}`)
    )
      .then(() => {
        res.send({
          message: "Profile image uploaded successfully",
          url: `/host/profile/${filename}`,
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: "Error while uploading",
        });
      });
  }
});

module.exports = router;
