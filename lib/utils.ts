import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ICategory } from "./database/models/category.model"
import { ITransaction } from "./database/models/transaction.model"
import { ICategoryFilter, IFilterRow } from "./database/models/categoryFilter.model"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}