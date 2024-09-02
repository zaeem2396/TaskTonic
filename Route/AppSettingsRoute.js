const express = require('express');
const router = express.Router();
const appSettings = require('../Controller/AppSettingsController')

router.get('/getAppSettings', appSettings.getSettings)

module.exports = router;