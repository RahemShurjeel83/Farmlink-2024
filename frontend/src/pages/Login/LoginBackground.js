import React from 'react';
import CSS from './LoginBackground.module.css';

const PRODUCE = [
  { emoji: '🛒', left: '8%',  size: '2rem',   dur: '10s', delay: '0s'   },
  { emoji: '🥦', left: '20%', size: '1.8rem',  dur: '12s', delay: '1.5s' },
  { emoji: '🍅', left: '33%', size: '2.2rem',  dur: '9s',  delay: '3s'   },
  { emoji: '🥕', left: '46%', size: '1.6rem',  dur: '11s', delay: '0.8s' },
  { emoji: '🍎', left: '59%', size: '2rem',   dur: '13s', delay: '2.2s' },
  { emoji: '🌽', left: '71%', size: '1.9rem',  dur: '10s', delay: '4s'   },
  { emoji: '🍋', left: '83%', size: '1.7rem',  dur: '12s', delay: '1s'   },
  { emoji: '🧅', left: '13%', size: '1.5rem',  dur: '14s', delay: '5s'   },
];

const BuyerBg = () => (
  <div className={CSS['buyer-bg']}>
    {PRODUCE.map((p, i) => (
      <span
        key={i}
        className={CSS['float-item']}
        style={{ left: p.left, fontSize: p.size, animationDuration: p.dur, animationDelay: p.delay }}
      >
        {p.emoji}
      </span>
    ))}
    <div className={CSS['market-glow']} />
  </div>
);

const VendorBg = () => (
  <div className={CSS['vendor-bg']}>
    <div className={CSS['sky']} />
    <div className={CSS['sun']} />
    <div className={CSS['cloud']} />
    <div className={CSS['cloud2']} />

    <div className={CSS['hill-l']} />
    <div className={CSS['hill-r']} />
    <div className={CSS['ground']} />

    {/* Trees */}
    <div className={`${CSS.tree} ${CSS['tree-l']}`}>
      <div className={CSS['tree-top']} />
      <div className={CSS['tree-trunk']} />
    </div>
    <div className={`${CSS.tree} ${CSS['tree-r']}`}>
      <div className={CSS['tree-top']} />
      <div className={CSS['tree-trunk']} />
    </div>

    {/* Barn */}
    <div className={CSS['barn']}>
      <div className={CSS['barn-roof']} />
      <div className={CSS['barn-body']}>
        <div className={CSS['barn-door']} />
      </div>
    </div>

    {/* Wheat left */}
    <div className={`${CSS['wheat-row']} ${CSS['wheat-l']}`}>
      {[0,1,2,3].map(i => (
        <div key={i} className={CSS['stalk']}>
          <div className={CSS['stalk-head']} />
          <div className={CSS['stalk-stem']} />
        </div>
      ))}
    </div>

    {/* Wheat right */}
    <div className={`${CSS['wheat-row']} ${CSS['wheat-r']}`}>
      {[0,1,2,3].map(i => (
        <div key={i} className={CSS['stalk']}>
          <div className={CSS['stalk-head']} />
          <div className={CSS['stalk-stem']} />
        </div>
      ))}
    </div>

    {/* Walking farmer */}
    <div className={CSS['farmer']}>🧑‍🌾</div>
  </div>
);

const LoginBackground = ({ role }) => (
  <>
    <div className={`${CSS.bg} ${role === 'Buyer'  ? '' : CSS['bg-hidden']}`}><BuyerBg /></div>
    <div className={`${CSS.bg} ${role === 'Vendor' ? '' : CSS['bg-hidden']}`}><VendorBg /></div>
  </>
);

export default LoginBackground;
