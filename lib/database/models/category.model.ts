import { Schema, model, models } from "mongoose";

export type ICategory = {
    userId?: string;
    name: string;
}


const CategorySchema = new Schema({
    userId: { type: String },
    name: { type: String, required: true }
});

// const CategoryFilter = models.CategoryFilterSchema || model("CategoryFilter", CategoryFilterSchema);
const Category = models.Category || model("Category", CategorySchema);

export default Category;