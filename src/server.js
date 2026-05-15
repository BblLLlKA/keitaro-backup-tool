import 'dotenv/config';

import app from './app.js';
import logger from './lib/logger.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    logger.info({ action: 'SERVER_STARTED', port: Number(PORT) });
});
