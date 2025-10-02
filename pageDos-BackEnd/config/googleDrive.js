const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// Cargar credenciales de la cuenta de servicio
const KEYFILEPATH = path.join(__dirname, 'inmobiliariagtCredenciales.json'); // falta el JSON de Google Cloud
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});

const driveService = google.drive({ version: 'v3', auth });

async function uploadFileToDrive(filePath, fileName, folderId) {
    const fileMetadata = {
        name: fileName,
        parents: [folderId], // ID de la carpeta en Drive
    };
    const media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(filePath),
    };

    const response = await driveService.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, webViewLink, webContentLink',
    });

    // Hacer el archivo público
    await driveService.permissions.create({
        fileId: response.data.id,
        requestBody: {
            role: 'reader',
            type: 'anyone',
        },
    });

    return {
        id: response.data.id,
        link: `https://drive.google.com/uc?id=${response.data.id}`,
    };
}

module.exports = { uploadFileToDrive };
