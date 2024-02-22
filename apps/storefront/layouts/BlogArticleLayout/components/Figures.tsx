import type { HTMLAttributes } from 'react';

export const Figures = ({ ...props }: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      width='195'
      height='209'
      viewBox='0 0 195 209'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <g opacity='0.6'>
        <rect
          x='35.8081'
          y='127.017'
          width='58.1427'
          height='58.1427'
          transform='rotate(27.436 35.8081 127.017)'
          stroke='#F5DDA6'
          strokeWidth='5'
        />
        <rect
          x='103.067'
          y='76.6936'
          width='60.0682'
          height='60.0682'
          rx='30.0341'
          transform='rotate(-16.0692 103.067 76.6936)'
          stroke='#FBBFC1'
          strokeWidth='5'
        />
        <path
          d='M88.9325 45.368L88.9303 45.3693C88.931 45.3688 88.9317 45.3684 88.9325 45.368L89.6659 46.6765L88.9325 45.368ZM86.6661 46.6383L25.4041 80.9764L26.2975 10.7529L86.6661 46.6383Z'
          stroke='#A5D6FB'
          strokeWidth='5'
        />
      </g>
    </svg>
  );
};
