interface CampaignHeaderProps {
  title: string;
  subtitle: string;
}

export const CampaignHeader = ({ title, subtitle }: CampaignHeaderProps) => {
  return (
    <div className="mb-6 sm:mb-8 text-center px-1">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1 sm:mb-2 leading-tight break-words">
        {title}
      </h1>
      <p className="text-sm sm:text-base md:text-lg text-kgb-gold line-clamp-2">{subtitle}</p>
    </div>
  );
};
