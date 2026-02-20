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
    const { search = "", city = "", dateFilter = "", isFree } = req.query;

    let filter = {};

    // ============================================
    // Text search → title, category, location
    // ============================================
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    // ============================================
    //  Filter by City
    // ============================================
    if (city) {
      filter.location = { $regex: city, $options: "i" };
    }

    // ============================================
    // Date Filters (Today / Tomorrow / Weekend)
    // ============================================
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateFilter === "today") {
      filter.startDate = today;
    }

    if (dateFilter === "tomorrow") {
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      filter.startDate = tomorrow;
    }

    if (dateFilter === "weekend") {
      filter.$expr = {
        $in: [{ $dayOfWeek: "$startDate" }, [1, 7]] // Sunday=1, Saturday=7
      };
    }

    // ============================================
    // 🎟 Free Events
    // ============================================
    if (isFree === "true") {
      filter.isTicketed = false;
    }

    // ============================================
    // ✔ Fetch events
    // ============================================
    const events = await Event.find(filter).sort({ startDate: 1 });

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
export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        const title = event.title
        res.json({ message: `Event ${title} is deleted successfully` })
    } catch (err) {
        console.error("Error fetching event:", err);
        res.status(500).json({ error: "Server Error" });
    }
};
export const editEvent = async (req, res) => {
    try {

        const { id } = req.params;

        const updateData = {
            ...req.body
        };

        // Convert tickets back to array
        if (req.body.tickets) {
            updateData.tickets = JSON.parse(req.body.tickets);
        }

        // Handle uploaded banners
        if (req.files?.length) {
            updateData.banners = req.files.map(file => ({
                url: `/uploads/${file.filename}`
            }));
        } else {
            delete updateData.banners;
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            updateData,
            { new: true } // return updated document
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({
            success: true,
            message: `Event "${updatedEvent.title}" updated successfully`,
            event: updatedEvent
        });

    } catch (err) {
        console.error("Error updating event:", err);
        res.status(500).json({ error: "Server Error" });
    }
};

