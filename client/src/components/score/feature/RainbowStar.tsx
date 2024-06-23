export const RainbowStar = ({ size = 24 }) => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={size} height={size} className='rainbow-star'>
    <path
      d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
      fill='none'
      stroke='url(#rainbow-gradient)'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <defs>
      <linearGradient id='rainbow-gradient' x1='0%' y1='0%' x2='100%' y2='0%'>
        <stop offset='0%' stopColor='#ff0000' />
        <stop offset='16.67%' stopColor='#ffff00' />
        <stop offset='33.33%' stopColor='#00ff00' />
        <stop offset='50%' stopColor='#00ffff' />
        <stop offset='66.67%' stopColor='#0000ff' />
        <stop offset='83.33%' stopColor='#ff00ff' />
        <stop offset='100%' stopColor='#ff0000' />
      </linearGradient>
    </defs>
  </svg>
);
