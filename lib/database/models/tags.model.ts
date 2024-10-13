import { Schema, model, models } from "mongoose";

export type ITag = {
    _id?: string;
    userId?: string;
    value: string;
    label: string;
}


const CategorySchema = new Schema({
    userId: { type: String },
    name: { type: String, required: true },
    ignore: { type: Boolean, required: true, default: false }
});

// const CategoryFilter = models.CategoryFilterSchema || model("CategoryFilter", CategoryFilterSchema);
const Category = models.Category || model("Category", CategorySchema);

export default Category;