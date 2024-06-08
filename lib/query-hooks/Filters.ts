'use client'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { getAllFilters, setCategoryFilter } from "../actions/filters.actions";
import { ICategoryFilter } from "../database/models/categoryFilter.model";



export const useGetFilters = () => {
    const { data, isLoading, error, ...rest } = useQuery({
        queryKey: ['filters'],
        queryFn: () => getAllFilters()
    })
    console.log(data, error)
    return {
        filters: data as ICategoryFilter[] || [],
        isLoading,
        error,
        ...rest,
    };
};




export const useAddFilter = () => {
    const { toast } = useToast()
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: filter => setCategoryFilter(filter),
        // () => {
        // return new Promise((_, reject) => {
        //     setTimeout(() => {
        //         reject(new Error('Error thrown after 1 second'));
        //     }, 1000);
        // });
        // },
        onMutate: async (filter: ICategoryFilter) => {
            await queryClient.cancelQueries({ queryKey: ['filters'] });
            const previousFilterList = queryClient.getQueryData<ICategoryFilter[]>(['filters']);
            if (previousFilterList && !previousFilterList.find(f => f._id === filter._id)) {
                queryClient.setQueryData<ICategoryFilter[]>(['filters'], (old) => [...old!, filter]);
            }

            return { previousFilterList };
        },
        onError: (err, variable, context) => {
            toast({ title: "Error creating new filter", description: "", duration: 1500 })
            if (context?.previousFilterList) {
                queryClient.setQueryData(['filters'], context.previousFilterList);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['filters'] });
        },
    });
};


