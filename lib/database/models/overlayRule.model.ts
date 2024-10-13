import { Schema, model, models } from 'mongoose';
import { ICategory } from './category.model';

export type IRuleRow = {
    field: string;
    operator: string;
    valuePrimary: string;
    valueSecondary?: string;
};

export type IOverlayRule = {
    _id?: string;
    overlay: {
        _category?: ICategory;
        _type?: 'include' | 'ignore' | 'fixed' | 'dynamic';
        _note?: string;
        _tags?: string[];
    };
    targetType: string;
    ruleRows: IRuleRow[];
};

const OverlayRuleSchema = new Schema({
    _id: { type: String, required: true },
    overlay: {
        _category: { type: Schema.Types.ObjectId, ref: 'Category' },
        _type: { type: String, enum: ['include', 'ignore', 'fixed', 'dynamic'] },
        _note: { type: String },
        _tags: { type: [String] },
    },
    targetType: { type: String, required: true },
    filters: [
        {
            field: { type: String, required: true },
            operator: { type: String, required: true },
            valuePrimary: { type: String, required: true },
            valueSecondary: { type: String, required: false },
        },
    ],
});

const OverlayRule = models.CategoryFilterSchema || model('OverlayRulw', OverlayRuleSchema);

export default OverlayRule;
