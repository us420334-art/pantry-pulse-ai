import mongoose from 'mongoose';

const pantryItemSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        quantity: {
            type: String,
            required: true,
            default: '1 item',
        },
        category: {
            type: String,
            default: 'General',
        },
    },
    { timestamps: true }
);

const PantryItem = mongoose.model('PantryItem', pantryItemSchema);
export default PantryItem;