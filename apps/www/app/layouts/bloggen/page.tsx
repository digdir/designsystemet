import { Outlet } from 'react-router';
import { ContentContainer } from '~/_components/content-container/content-container';

export default function MonstreLayout() {
  return (
    <ContentContainer>
      <Outlet />
    </ContentContainer>
  );
}
