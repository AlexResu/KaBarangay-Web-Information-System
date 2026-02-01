import express from 'express';
import * as crud from './crud.js';

const router = express.Router();

// GET All
router.get('/', async (req, res) => {
  try {
    console.log("Received request for announcements with headers:", req.headers);
    const isAdmin = !!req.headers["x-admin"];
    const filter = isAdmin ? {} : { is_hidden: false };
    const data = await crud.getAllAnnouncements(filter);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST New
router.post('/', async (req, res) => {
  try {
    const result = await crud.createAnnouncement(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT Update
router.put('/:id', async (req, res) => {
  try {
    const result = await crud.updateAnnouncement(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH hidden
router.patch('/:id/toggle-hidden', async (req, res) => {
  try {
    const result = await crud.toggleHidden(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const result = await crud.deleteAnnouncement(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
