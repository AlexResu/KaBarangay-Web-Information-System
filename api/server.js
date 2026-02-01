import express from 'express';
import cors from 'cors';
import announcementRoutes from './announcements/routes.js';
import officialRoutes from './officials/routes.js';
import documentRequestRoutes from './document-request/routes.js';
import adminRoutes from './admins/routes.js';

const app = express();
app.use(cors());
app.use(express.json()); // Essential: allows Express to read JSON in request bodies

const PORT = 3000;

// --- ROUTES ---
app.use('/api/announcements', announcementRoutes);
app.use('/api/officials', officialRoutes); 
app.use('/api/document-requests', documentRequestRoutes);
app.use('/api/admins', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});