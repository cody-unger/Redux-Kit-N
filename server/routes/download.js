'use strict';
const express = require('express');
const router = express.Router();
const exportWorker = require('../../export_worker/composer.js');

router.route('/')
  .get((req, res) => {
    req.onion = JSON.parse(req.query.onion);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment;filename=redux_kit_n_package.zip');
    exportWorker.composer(req, res);
  });

module.exports = router;
