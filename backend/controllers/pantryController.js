import PantryItem from '../models/PantryItem.js';

// Get all pantry items for logged in user
export const getPantryItems = async (req, res) => {
  try {
    const items = await PantryItem.find({ user: req.user.id });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error: error.message });
  }
};

// Add a new pantry item
export const addPantryItem = async (req, res) => {
  try {
    const { name, quantity } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Item name is required" });
    }

    const newItem = await PantryItem.create({
      user: req.user.id,
      name,
      quantity
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Error adding item", error: error.message });
  }
};

// Delete a pantry item
export const deletePantryItem = async (req, res) => {
  try {
    const item = await PantryItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Verify user owns the item
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await item.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error: error.message });
  }
};