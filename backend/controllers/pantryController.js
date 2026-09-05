// Example backend controller for adding pantry items
const addItem = async (req, res) => {
    try {
        const { name, quantity } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Item name is required." });
        }

        // Ensure the item is tied to req.user.id from your auth middleware
        const newItem = await PantryItem.create({
            user: req.user.id,
            name,
            quantity,
        });

        res.status(201).json(newItem);
    } catch (error) {
        console.error("Error adding pantry item:", error);
        res.status(500).json({ message: "Server error while adding item.", error: error.message });
    }
};