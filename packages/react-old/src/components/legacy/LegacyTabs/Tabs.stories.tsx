import type { Meta, StoryFn } from '@storybook/react';

import { LegacyTabs } from './Tabs';

export default {
  title: 'Avviklet/LegacyTabs',
  component: LegacyTabs,
} as Meta;

export const Eksempel: StoryFn<typeof LegacyTabs> = (args) => (
  <LegacyTabs {...args} />
);

Eksempel.args = {
  items: [
    {
      name: 'Ild',
      content: (
        <p>
          Nulla nec rutrum libero. Curabitur lorem est, tempor nec iaculis in,
          egestas eu lacus. Ut malesuada risus ut ipsum consequat mattis. Donec
          quis nunc ut lorem suscipit pharetra. Nulla ornare sed nisl nec
          facilisis. Sed in lacinia elit. Sed et eleifend nisi. Sed egestas
          nulla lobortis sapien scelerisque, at venenatis risus elementum.
          Aliquam eleifend, metus non molestie viverra, erat sem ornare enim,
          nec suscipit nulla nisi vel dolor. Etiam volutpat sapien arcu. Orci
          varius natoque penatibus et magnis dis parturient montes, nascetur
          ridiculus mus. Nulla sollicitudin molestie leo sit amet faucibus. Sed
          interdum condimentum interdum. Praesent volutpat turpis mattis purus
          venenatis egestas. In iaculis condimentum fringilla. Duis dignissim
          turpis mattis tristique vulputate.
        </p>
      ),
    },
    {
      name: 'Jord',
      content: (
        <p>
          Vestibulum nisl diam, tempus sit amet justo eu, semper facilisis
          dolor. Proin scelerisque tellus sit amet consectetur condimentum.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque et
          dui vehicula, semper arcu vitae, posuere odio. Pellentesque eu ante in
          elit semper pellentesque. Donec cursus eros non diam condimentum
          viverra. Pellentesque at odio lorem. Aenean ac enim et risus bibendum
          scelerisque et a purus. Donec ultricies, ex et ornare fringilla,
          turpis ex consectetur ante, ut porta libero metus quis magna. Nulla eu
          hendrerit ex, non dapibus quam. Nulla dictum ligula tellus, et
          elementum orci convallis sit amet. Class aptent taciti sociosqu ad
          litora torquent per conubia nostra, per inceptos himenaeos. Fusce
          dolor orci, sagittis vel elit eget, viverra ultrices nulla.
        </p>
      ),
    },
    {
      name: 'Luft',
      content: (
        <p>
          Integer dictum lacus vitae urna lobortis, scelerisque varius metus
          maximus. Integer ornare pharetra metus, vel mattis urna. Interdum et
          malesuada fames ac ante ipsum primis in faucibus. Nulla consectetur
          ipsum ac magna sollicitudin, ac fermentum sem tempus. Proin rutrum
          aliquam eros eu accumsan. Duis rhoncus urna a tellus sagittis, eu
          aliquam dui pharetra. Praesent eu libero consectetur, varius urna
          quis, volutpat magna. Vivamus ornare magna at vehicula pulvinar.
          Curabitur risus lorem, placerat sit amet mollis venenatis, placerat
          sed ligula. Donec pellentesque quis est nec viverra. Sed ultricies
          aliquam nunc, sit amet faucibus augue tempor quis. Pellentesque
          porttitor sapien quis risus placerat, in facilisis augue molestie.
        </p>
      ),
    },
    {
      name: 'Vann',
      content: (
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel
          leo nibh. Fusce neque nulla, semper quis rutrum eu, volutpat nec
          mauris. In lacinia iaculis venenatis. Aliquam pulvinar lectus lorem, a
          congue nulla dictum vel. Donec augue eros, cursus ut porta eu, mollis
          sodales odio. Vestibulum rutrum sollicitudin nisi, sed facilisis nibh
          dictum at. Nulla arcu mi, iaculis quis luctus at, vulputate hendrerit
          quam. Suspendisse condimentum pellentesque varius. Nullam molestie
          dictum pellentesque. Nunc felis sem, elementum a sapien a, consectetur
          ullamcorper tellus. Nullam porta tempus nisl, in vehicula quam congue
          eget.
        </p>
      ),
    },
  ],
};
