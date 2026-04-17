import React from 'react';

const BackToTop: React.FC = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="flex justify-center pb-20 pt-10">
            <button 
                onClick={scrollToTop}
                className="back-to-top-btn group"
                aria-label="Back to Top"
            >
                <div className="relative flex items-center justify-center w-full h-full">
                    <svg className="back-to-top-svg transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-10" viewBox="0 0 384 512">
                        <path
                            className="fill-accent group-hover:fill-accent-foreground"
                            d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
                        ></path>
                    </svg>
                    <span className="absolute opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 text-accent-foreground font-bold whitespace-nowrap transition-all duration-300 pointer-events-none">
                        BACK TO TOP
                    </span>
                </div>
            </button>

            <style>{`
                .back-to-top-btn {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background-color: hsl(var(--card));
                    border: 1px solid hsl(var(--border));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0px 0px 0px 4px hsl(var(--accent) / 0.1);
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
                    overflow: hidden;
                    position: relative;
                }

                .back-to-top-svg {
                    width: 14px;
                }

                .back-to-top-btn:hover {
                    width: 150px;
                    border-radius: 50px;
                    background-color: hsl(var(--accent));
                    box-shadow: 0px 10px 20px hsl(var(--accent) / 0.2);
                    border-color: hsl(var(--accent));
                }

                .back-to-top-btn:active {
                    transform: scale(0.95);
                }
            `}</style>
        </div>
    );
};

export default BackToTop;
