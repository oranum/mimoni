import { Schema, model, models } from "mongoose";
import { ICategory } from "./category.model";

export type IFilterRow = {
    field: string;
    operator: string;
    valuePrimary: string;
    valueSecondary?: string;
}

export type ICategoryFilter = {
    _id?: string;
    category: ICategory;
    targetType: string;
    filterRows: IFilterRow[];
}


const CategoryFilterSchema = new Schema({
    _id: { type: String, required: true },
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