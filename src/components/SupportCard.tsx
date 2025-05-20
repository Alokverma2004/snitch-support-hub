
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type SupportCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

const SupportCard = ({ title, description, icon, className, onClick }: SupportCardProps) => {
  return (
    <Card 
      className={cn(
        "transition-all duration-300 hover:shadow-lg border border-gray-100 h-full cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="mb-4 p-3 bg-muted rounded-full">
          {icon}
        </div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};

export default SupportCard;
