const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // ⚡ Ruta absoluta hacia tu carpeta de imágenes en el Frontend
    // (Ajusta los '../' según la ubicación exacta de tu backend respecto a tu frontend)
    const frontendImagePath = path.join(__dirname, '../../DragonBallFrontend/public/image');
    cb(null, frontendImagePath);
  },
  filename: (req, file, cb) => {
    // Si prefieres guardar solo el nombre limpio del archivo original o un sufijo único:
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `producto-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage });
module.exports = upload;