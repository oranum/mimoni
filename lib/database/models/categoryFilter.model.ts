import { Schema, model, models } from "mongoose";

export type IFilterRow = {
    field: string;
    operator: string;
    valuePrimary: string;
    valueSecondary?: string;
}

export type ICategoryFilter = {
    category: string;
    targetType: string;
    filters: IFilterRow[];
}


const CategoryFilterSchema = new Schema({
    category: { type: String, required: true },
    filters: [
        {
            field: { type: String, required: true },
            operator: { type: String, required: true },
            valuePrimary: { type: String, required: true },
            valueSecondary: { type: String, required: false }
        }
    ]
});

const CategoryFilter = models.CategoryFilterSchema || model("CategoryFilter", CategoryFilterSchema);

export default CategoryFilter;