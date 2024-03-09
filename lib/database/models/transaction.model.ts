import { Schema, model, models } from "mongoose";

export interface ITransaction {
    _id?: string;
    type: string;
    identifier: any;
    date: string;
    processedDate: string;
    originalAmount: number;
    originalCurrency: string;
    chargedAmount: number;
    description: string;
    memo: string;
    status: string;
    accountNumber: string;
    hash: string;
    category: string;
    _createdAt?: Date;
    _calibratedDate?: Date;
    _convertedILSAmount?: number;
    _isProcessed?: boolean;
    _category?: { _id: string, name: string },
    _note?: string;
    _tags?: string[];
    _lastUpdated?: Date;
    _isAutoCategory?: boolean;
    _isApproved?: boolean;
}


const TransactionSchema = new Schema({
    type: { type: String },
    identifier: { type: Schema.Types.Mixed },
    date: { type: String, required: true },
    processedDate: { type: String, required: true },
    originalAmount: { type: Number, required: true },
    originalCurrency: { type: String, required: true },
    chargedAmount: { type: Number, required: true },
    description: { type: String, required: true },
    memo: { type: String },
    status: { type: String },
    accountNumber: { type: String, required: true },
    hash: { type: String, required: true },
    category: { type: String },
    _createdAt: { type: Date, required: true, default: Date.now },
    _calibratedDate: { type: Date },
    _convertedILSAmount: { type: Number },
    _isProcessed: { type: Boolean, required: true, default: false },
    _category: { type: Schema.Types.ObjectId, ref: "Category" },
    _note: { type: String },
    _tags: { type: [String] },
    _lastUpdated: { type: Date },
    _isAutoCategory: { type: Boolean },
    _isApproved: { type: Boolean, required: true, default: false }
});

const Transaction = models.Transaction || model("Transaction", TransactionSchema);

export default Transaction;