import express from "express";
import {
  uploadSingle,
  uploadMultiple,
  uploadWithMask,
} from "../middleware/upload.js";
import {
  analyzeImage,
  textToImage,
  imageToImage,
  modifyElements,
  maskEdit,
  combineImages,
  generate360View,
  imageChat,
  generateMarketingContent,
  getMarketingOptions,
  upscaleImageEndpoint,
} from "../controllers/imageController.js";

const router = express.Router();

router.post("/analyze", uploadSingle, analyzeImage);
router.post("/generate", textToImage);
router.post("/edit", uploadSingle, imageToImage);
router.post("/elements", uploadSingle, modifyElements);
router.post("/mask-edit", uploadWithMask, maskEdit);
router.post("/combine", uploadMultiple, combineImages);
router.post("/360-view", uploadSingle, generate360View);
router.post("/upscale", uploadSingle, upscaleImageEndpoint);
router.post("/chat", uploadSingle, imageChat);
// router.post("/marketing", uploadSingle, generateMarketingContent);
router.post("/marketing", maybeUploadSingle, generateMarketingContent);

router.get("/marketing/options", getMarketingOptions);

export default router;
