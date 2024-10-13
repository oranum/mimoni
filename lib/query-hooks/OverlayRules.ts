'use client'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { getAllOverlayRules, setOverlayRule } from "../actions/filters.actions";
import { ICategoryFilter } from "../database/models/categoryFilter.model";
import { IOverlayRule, IRuleRow } from "../database/models/overlayRule.model";



export const useGetOverlayRules = () => {
    const { data, isLoading, error, ...rest } = useQuery({
        queryKey: ['rules'],
        queryFn: () => getAllOverlayRules()
    })
    console.log(data, error)
    return {
        rules: data as IOverlayRule[] || [],
        isLoading,
        error,
        ...rest,
    };
};




export const useAddOverlayRule = () => {
    const { toast } = useToast()
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: rule => setOverlayRule(rule),
        // () => {
        // return new Promise((_, reject) => {
        //     setTimeout(() => {
        //         reject(new Error('Error thrown after 1 second'));
        //     }, 1000);
        // });
        // },
        onMutate: async (rule: IOverlayRule) => {
            await queryClient.cancelQueries({ queryKey: ['rules'] });
            const previousFilterList = queryClient.getQueryData<IOverlayRule[]>(['rules']);
            if (previousFilterList && !previousFilterList.find(f => f._id === rule._id)) {
                queryClient.setQueryData<IOverlayRule[]>(['rules'], (old) => [...old!, rule]);
            }

            return { previousRulesList: previousFilterList };
        },
        onError: (err, variable, context) => {
            toast({ title: "Error creating new rule", description: "", duration: 1500 })
            if (context?.previousRulesList) {
                queryClient.setQueryData(['rules'], context.previousRulesList);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['rules'] });
        },
    });
};


