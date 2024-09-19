import type { Meta, StoryFn } from '@storybook/react';
import { useEffect, useState } from 'react';

import { Pagination, usePagination } from '.';

export default {
  title: 'Komponenter/Pagination',
  component: Pagination,
} as Meta;

// export const Preview: StoryFn<typeof Pagination> = (args) => {
//   const [currentPage, setCurrentPage] = useState(args.currentPage);

//   useEffect(() => {
//     setCurrentPage(args.currentPage);
//   }, [args.currentPage]);

//   return (
//     <Pagination {...args} onChange={setCurrentPage} currentPage={currentPage} />
//   );
// };
// Preview.args = {
//   'aria-label': 'Sidenavigering',
//   size: 'md',
//   nextLabel: 'Neste',
//   previousLabel: 'Forrige',
//   totalPages: 10,
//   hideLabels: false,
//   compact: false,
//   currentPage: 1,
//   itemLabel: (num) => `Side ${num}`,
// };

export const Preview: StoryFn<typeof Pagination> = ({ totalPages = 10 }) => {
  const { pages, goNext, goPrevious, hasNext, hasPrevious } = usePagination({
    currentPage: 4,
    totalPages,
  });

  return (
    <Pagination aria-label='Sidenavigering'>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Button onClick={goPrevious} disabled={!hasPrevious}>
            Forrige
          </Pagination.Button>
        </Pagination.Item>
        {pages.map(({ page, ...rest }, index) => (
          <Pagination.Item key={index}>
            <Pagination.Button {...rest}>{page}</Pagination.Button>
          </Pagination.Item>
        ))}
        <Pagination.Item>
          <Pagination.Button onClick={goNext} disabled={!hasNext}>
            Neste
          </Pagination.Button>
        </Pagination.Item>
      </Pagination.List>
    </Pagination>
  );
};

// export const WithAnchor: StoryFn<typeof Pagination> = (args) => {
//   const { totalPages = 4 } = args;
//   const { pages, currentPage } = usePagination({
//     currentPage: 2,
//     totalPages,
//   });

//   return (
//     <Pagination aria-label='Sidenavigering'>
//       <Pagination.List>
//         <Pagination.Item>
//           <Pagination.Previous asChild aria-label='Naviger til forrige side'>
//             <a href='#forrige-side'>Forrige</a>
//           </Pagination.Previous>
//         </Pagination.Item>

//         {pages.map((page, index) => (
//           <Pagination.Item key={`${page}-${index}`}>
//             {page === 'ellipsis' ? (
//               <Pagination.Ellipsis />
//             ) : (
//               <Pagination.Button
//                 asChild
//                 isActive={currentPage === page}
//                 aria-label={`Naviger til side ${page}`}
//               >
//                 <a href={`#side-${page}`}> {page}</a>
//               </Pagination.Button>
//             )}
//           </Pagination.Item>
//         ))}

//         <Pagination.Item>
//           <Pagination.Next asChild aria-label='Naviger til neste side'>
//             <a href='#neste-side'>Neste</a>
//           </Pagination.Next>
//         </Pagination.Item>
//       </Pagination.List>
//     </Pagination>
//   );
// };
