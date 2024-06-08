'use client'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { createCategoryAction, getCategoryList } from "../actions/categories.actions";
import { ICategory } from "../database/models/category.model";



export const useGetCategories = () => {
    const { data, isLoading, error, ...rest } = useQuery({
        queryKey: ['categories'],
        queryFn: () => getCategoryList()
    })
    console.log(data, error)
    return {
        categories: data as ICategory[] || [],
        isLoading,
        error,
        ...rest,
    };
};




export const useAddCategory = () => {
    const { toast } = useToast()
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: category => createCategoryAction(category),
        // () => {
        // return new Promise((_, reject) => {
        //     setTimeout(() => {
        //         reject(new Error('Error thrown after 1 second'));
        //     }, 1000);
        // });
        // },
        onMutate: async (category: ICategory) => {
            await queryClient.cancelQueries({ queryKey: ['categories'] });

            const previousCategoryList = queryClient.getQueryData<ICategory[]>(['categories']);
            if (previousCategoryList && !previousCategoryList.find(c => c.name === category.name)) {
                queryClient.setQueryData<ICategory[]>(['categories'], (old) => [...old!, category]);
            }

            return { previousCategoryList };
        },
        onError: (err, variable, context) => {
            toast({ title: "Error creating new category", description: "", duration: 1500 })
            if (context?.previousCategoryList) {
                queryClient.setQueryData(['categories'], context.previousCategoryList);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};





