import express from 'express';
import * as crud from './crud.js';

const router = express.Router();

// GET All
router.get('/', async (req, res) => {
  try {
    const filter = req.query.is_deleted ? { is_deleted: req.query.is_deleted === "true" } : {};
    const data = await crud.getAllOfficials(filter);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST New
router.post('/', async (req, res) => {
  try {
    const result = await crud.createOfficial(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT Update
router.put('/:id', async (req, res) => {
  try {
    const result = await crud.updateOfficial(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const result = await crud.deleteOfficial(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
