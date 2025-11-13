import Event from '../models/eventModel.js';

// Assuming banners are uploaded using multer or a similar middleware
export const createEvent = async (req, res) => {
    try {
        const {
            title,
            category,
            startDate,
            startTime,
            endTime,
            location,
            description,
            isTicketed,
            ticketName,
            ticketPrice,
        } = req.body;

        // handle uploaded images (from multer or cloud upload)
        const banners = (req.files || []).map((file) => ({
            url: `/uploads/${file.filename}`, // or cloud URL
        }));

        const newEvent = new Event({
            title,
            category,
            startDate,
            startTime,
            endTime,
            location,
            description,
            banners,
            isTicketed,
            ticketName,
            ticketPrice,
        });

        await newEvent.save();
        res.status(201).json({ success: true, event: newEvent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
