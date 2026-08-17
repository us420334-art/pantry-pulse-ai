import PantryItem from '../models/PantryItem.js';

// Get all pantry items for logged in user
export const getPantryItems = async (req, res) => {
    try {
        const items = await PantryItem.find({ user: req.user._id });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Add a new pantry item
export const addPantryItem = async (req, res) => {
    const { name, quantity, category } = req.body;

    try {
        const item = new PantryItem({
            user: req.user._id,
            name,
            quantity,
            category,
        });

        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(400).json({ message: 'Invalid item data' });
    }
};

// Delete a pantry item
export const deletePantryItem = async (req, res) => {
    try {
        const item = await PantryItem.findById(req.params.id);

        if (item && item.user.toString() === req.user._id.toString()) {
            await item.deleteOne();
            res.json({ message: 'Item removed' });
        } else {
            res.status(404).json({ message: 'Item not found or unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};