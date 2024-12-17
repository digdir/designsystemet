import { BorderRadiusInput } from '../../BorderRadiusInput/BorderRadiusInput';

type RadiusPageProps = {
  onPrevClick: () => void;
  onNextClick?: () => void;
};

export const RadiusPage = ({ onPrevClick, onNextClick }: RadiusPageProps) => {
  return <BorderRadiusInput />;
};
