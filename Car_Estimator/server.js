const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const distPath = path.join(__dirname, 'dist');
const staticPath = path.join(__dirname, 'static');
const indexPath = path.join(distPath, 'index.html');
const port = Number(process.env.PORT || 80);
const cacheMaxAge = 1000 * 60 * 15;

app.use('/assets', express.static(path.join(staticPath, 'assets'), { maxAge: cacheMaxAge }));
app.use('/files', express.static(path.join(staticPath, 'files'), { maxAge: cacheMaxAge }));
app.use('/backend', express.static(path.join(staticPath, 'backend'), { maxAge: cacheMaxAge }));
app.use(express.static(distPath, { maxAge: cacheMaxAge }));

app.get('*', (_, response) => {
    if (!fs.existsSync(indexPath)) {
        response.status(500).send('React build is missing. Run "npm run build" before "npm start".');
        return;
    }

    response.sendFile(indexPath);
});

app.listen(port, () => {
    console.log(`Car Estimator frontend is running on port ${port}`);
});
