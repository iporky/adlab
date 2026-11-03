import multer from 'multer';

export const SUPPORTED_MIME_TYPES = {
  EXCEL: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
};

/**
 * Configure multer for file uploads
 * @param {Object} options - Configuration options
 * @param {Array<string>} [options.mimeTypes] - Array of allowed MIME types
 * @param {number} [options.maxSize] - Maximum file size in bytes
 * @returns {multer.Multer} Configured multer instance
 */
export function createFileUploadMiddleware(options = {}) {
  const storage = multer.memoryStorage();

  return multer({
    storage,
    fileFilter: (req, file, cb) => {
      const { logger } = req.app.locals;
      logger.info('File upload attempt:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        fieldname: file.fieldname,
        headers: file.headers,
      });

      const allowedTypes = options.mimeTypes || SUPPORTED_MIME_TYPES.EXCEL;

      if (allowedTypes.includes(file.mimetype)) {
        logger.info('File type accepted:', file.mimetype);
        cb(null, true);
      } else {
        logger.error('Invalid file type:', file.mimetype);
        cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`));
      }
    },
    limits: {
      fileSize: options.maxSize || 5 * 1024 * 1024, // 5MB default
    },
  });
}
