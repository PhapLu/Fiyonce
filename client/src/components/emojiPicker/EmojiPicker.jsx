import { ca } from 'date-fns/locale';
import { useRef, useEffect, useState } from 'react';
import { codePointToEmoji } from '../../utils/iconDisplayer';

// Emoji categories with Unicode code points
const emojiCategories = {
    emotions: {
        representative: '128512',
        emojis: [
            '128520',
            '128519',
            '128526',
            '128514',
            '128518',
            '0x1F970',
            '0x1F60A',
            '0x1F92D',
            '0x1F634',
            '128552',
            '129297',
            '129303',
            '129321',
            '129324',
            '128545',
            '129322',
            '129325',
            '129395',
            '0x1F631',
        ],
    },
    catsAndHearts: {
        representative: '0x1F498',
        emojis: [
            '128568',
            '128569', '128570', '128571',
            '128572', '128573', '128574',
            '128575',
            '128576',
            '0x1F498',
            '0x1F49D',
            '0x1F496',
            '129505',
            '0x1F49B',
            '0x1F49C',
            '0x1F499',
            '0x1FA75',
            '0x1F5A4',
            '129294',
            '0x1F90D',


        ],
    },
    foodies: {
        representative: '0x1F35F',
        emojis: [
            '0x1F35F', '0x1F355', '0x1F96A', '0x1F969',
            '0x1F950', '0x1F35E', '0x1F956', '0x1FAD3',
            '0x1F9C7', '0x1F9C0	', '0x1F32D',
            '0x1F369',
            '0x1F382',
            '0x1F9C1',
            '0x1F36D',
            '0x1F36B',
            '129361', '129362', '129363',
            '129364', '129365', '129366',
            '129367', '129368', '129369',
            '129370', '129371', '129372',
            '129373', '129374', '129375',
            '129376', '129379', '129380',
            '129381', '129382', '129383',
            '129384', '129385', '129386',
            '129387', '129388', '129389',
        ],
    },
    plants: {
        representative: '0x1F331',
        emojis: [
            '0x1FAB4', '0x1F333', '0x1F335',
            '0x2618', '0x1F340', '0x1F341',
            '0x1F344', '0x1F34B', '0x1F951',
            '0x1F34A', '0x1F347', '0x1F349',
            '0x1F955',
        ]
    },
    animals: {
        representative: '129408',
        emojis: [
            '0x1F436',
            '0x1F42F',
            '0x1F984',
            '0x1F437',
            '0x1F414',
            '0x1F423',
            '0x1F426',
            '0x1F438',
            '0x1F996',
            '0x1F433',
            '0x1FABC',
            '0x1F980',
            '0x1F99E',
            '0x1F990',
            '0x1F991',
            '129409', '129410', '129411',
            '129412', '129413', '129414',
            '129415', '129416', '129417',
            '129418', '129419', '129420',
            '129421', '129422', '129423',
            '129424', '129425', '129426',
            '129427', '129428', '129429',
            '129430', '129431', '129432',
            '129433', '129434', '129435',
            '129436', '129437', '129438',
            '129439', '129440', '129441',
            '129442', '129443', '129444',
            '129445', '129446', '129447',
            '129448', '129449', '129450',
            '129451', '129452', '129453',
            '129454', '128584', '128585',
            '128586',
        ],
    },
    others: {
        representative: '128681',
        emojis: [
            '0x1F3AF',
            '0x1F3A8',
            '0x1F451',
            '0x1F4CC',
            '0x1F396',
            '0x1F3C6',
            '0x1F3C5',
            '0x1F947',
            '0x1F948',
            '0x1F949',
            '0x1F94F',
            '128640', '129399',
            '129351', '129352', '129353',
            '129314', '129313', '129302',
            '129482', '129504', '129535',
            '0x1F479', '0x1F47B', '0x1F47E'
        ],
    },
};

export default function EmojiPicker({ onEmojiClick, onClickOutside }) {
    const [selectedCategory, setSelectedCategory] = useState('emotions');
    const emojiPickerRef = useRef();

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const handleClickOutside = (e) => {
        if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
            onClickOutside();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className='emoji-container' ref={emojiPickerRef}>
            <div className="emoji-category-container" style={{ marginBottom: '10px' }}>
                {Object.keys(emojiCategories).map((key) => (
                    <span className='emoji-category-item'
                        key={key}
                        style={{ fontSize: '24px', margin: '5px', cursor: 'pointer' }}
                        onClick={() => handleCategoryClick(key)}
                    >
                        {codePointToEmoji(emojiCategories[key].representative)}
                    </span>
                ))}
            </div>

            <hr />

            {selectedCategory && (
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        maxHeight: '300px',
                        overflowY: 'scroll',
                    }}
                >
                    {emojiCategories[selectedCategory].emojis.map((emoji, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                margin: '5px',
                                cursor: 'pointer',
                            }}
                            onClick={() => onEmojiClick(emoji)}
                        >
                            <span style={{ fontSize: '24px', marginRight: '8px' }}>{codePointToEmoji(emoji)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};