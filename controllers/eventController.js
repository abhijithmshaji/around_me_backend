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
            host,
            contact
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
            host,
            contact
        });

        await newEvent.save();
        const populatedEvent = await newEvent.populate("host", "name email phone profileImage");

        res.status(201).json({
            success: true,
            event: populatedEvent
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        console.error("Error fetching events:", err);
        res.status(500).json({ error: "Server Error" });
    }
};

export const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        res.json(event)
    } catch (err) {
          console.error("Error fetching event:", err);
        res.status(500).json({ error: "Server Error" });
    }
};
