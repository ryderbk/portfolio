import cloudinary from './cloudinary';

/**
 * Handle File Upload to Cloudinary (Express Handler)
 */
export async function uploadHandler(req: any, res: any) {
    try {
        const { fileDataURI, folder = 'portfolio' } = req.body;

        if (!fileDataURI) {
            return res.status(400).json({ error: 'No file data provided' });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(fileDataURI, {
            folder: folder,
            resource_type: 'auto',
            transformation: [
                { quality: 'auto', fetch_format: 'auto' }
            ]
        });

        return res.json({
            success: true,
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
        });
    } catch (error: any) {
        console.error('Upload error:', error);
        return res.status(500).json({ error: error.message || 'Failed to upload image' });
    }
}

/**
 * Handle File Deletion from Cloudinary (Express Handler)
 */
export async function deleteUploadHandler(req: any, res: any) {
    try {
        const { publicId } = req.body;

        if (!publicId) {
            return res.status(400).json({ error: 'No public_id provided' });
        }

        const result = await cloudinary.uploader.destroy(publicId);

        return res.json({
            success: true,
            result,
        });
    } catch (error: any) {
        console.error('Delete error:', error);
        return res.status(500).json({ error: error.message || 'Failed to delete image' });
    }
}
