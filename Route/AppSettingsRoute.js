const express = require('express');
const router = express.Router();
const appSettings = require('../Controller/AppSettingsController')

router.get('/appSettings', appSettings.getSettings)
router.post('/appSettings', appSettings.createSettings)

module.exports = router;