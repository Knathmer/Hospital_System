import express from 'express';
import { getOfficeLocations } from '../controllers/officeController.js';

const router = express.Router();

router.get('/getOfficeLocations', getOfficeLocations);

export default router;