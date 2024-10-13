import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CheckSquare, Square } from 'lucide-react';

interface CheckmarkButtonProps {
    isChecked: boolean;
    text: string;
}

const CheckmarkButton = ({ isChecked, text }: CheckmarkButtonProps) => {
    return (
        <Button
            asChild
            variant="secondary"
            className={`relative transition-all duration-200 hover:
                ${
                    isChecked
                        ? 'bg-grey-100 border-b-2 border-gray-400 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3)]'
                        : 'bg-white border-b-4 border-gray-300 shadow-[4px_4px_8px_rgba(0,0,0,0.3)]'
                }
               
               
              `}
        >
            <div className="flex flex-row justify-between gap-2 items-center p-2">
                <Label className="text-md text-center">{text}</Label>
                {isChecked ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
            </div>
        </Button>
    );
};

export default CheckmarkButton;
