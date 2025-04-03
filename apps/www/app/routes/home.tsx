import { Details, Heading, List } from '@digdir/designsystemet-react';
import { Link, useParams } from 'react-router';
import { ContentContainer } from '~/_components/content-container/content-container';

export default function Home() {
  const { lang } = useParams();

  return (
    <ContentContainer>
      <Heading level={1} data-size='xl'>
        Designsystemet ({lang})
      </Heading>
      <List.Unordered>
        <List.Item>
          <Link to='/nb/monstre/ein'>Gå til Monstre 1</Link>
        </List.Item>
        <List.Item>
          <Link to='/nb/monstre/to'>Gå til Monstre 2</Link>
        </List.Item>
        <List.Item>
          <Link to='/nb/monstre/tre'>Gå til Monstre 3 (kun norsk)</Link>
        </List.Item>
      </List.Unordered>
      <Details>
        <Details.Summary>Om</Details.Summary>
        <Details.Content>
          Dette er ein test av React Router med MDX og bundling av innhald.
        </Details.Content>
      </Details>
    </ContentContainer>
  );
}
