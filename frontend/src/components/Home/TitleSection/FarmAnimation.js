import React from 'react';
import CSS from './FarmAnimation.module.css';

const FarmAnimation = () => (
    <div className={CSS.scene}>
        <div className={CSS.sky} />

        <div className={CSS.sun} />

        <div className={`${CSS.cloud} ${CSS.cloud1}`} />
        <div className={`${CSS.cloud} ${CSS.cloud2}`} />

        <div className={CSS.hill1} />
        <div className={CSS.hill2} />

        <div className={`${CSS.tree} ${CSS.treeLeft}`}>
            <div className={CSS.treeTop} />
            <div className={CSS.treeTrunk} />
        </div>
        <div className={`${CSS.tree} ${CSS.treeRight}`}>
            <div className={CSS.treeTop} />
            <div className={CSS.treeTrunk} />
        </div>

        <div className={CSS.barn}>
            <div className={CSS.barnRoof} />
            <div className={CSS.barnBody}>
                <div className={CSS.barnDoor} />
            </div>
        </div>

        <div className={`${CSS.wheat} ${CSS.wheatLeft}`}>
            {[0, 1, 2].map(i => (
                <div key={i} className={CSS.stalk}>
                    <div className={CSS.stalkHead} />
                    <div className={CSS.stalkStem} />
                </div>
            ))}
        </div>
        <div className={`${CSS.wheat} ${CSS.wheatRight}`}>
            {[0, 1, 2].map(i => (
                <div key={i} className={CSS.stalk}>
                    <div className={CSS.stalkHead} />
                    <div className={CSS.stalkStem} />
                </div>
            ))}
        </div>

        <div className={CSS.ground} />
    </div>
);

export default FarmAnimation;
