import React, { useEffect } from "react";

function KakaoShareButton({ videoUrl }) {
    useEffect(() => {
        createKakaoButton()
    }, [])
    
    const createKakaoButton = () => {
        if (window.Kakao) {
            const kakao = window.Kakao;
            if (!kakao.isInitialized()) {
                kakao.init(process.env.VITE_APP_KAKAO_KEY);
            }
            kakao.Link.createDefaultButton({
                container: '#kakao-link-btn',
                objectType: 'video',
                content: {
                    title: '비디오 공유',
                    description: '카카오톡으로 비디오를 공유합니다.',
                    imageUrl: 'IMAGE_URL', // 비디오 썸네일 이미지 URL
                    link: {
                        mobileWebUrl: videoUrl,
                        webUrl: videoUrl,
                    },
                },
                buttons: [
                    {
                        title: '카카오톡으로 공유하기',
                        link: {
                            mobileWebUrl: videoUrl,
                            webUrl: videoUrl,
                        },
                    },
                ],
            });
        }
    };

    return (
        <div className="kakao-share-button">
            <button id="kakao-link-btn" onClick={()=>{shareKakao()}}>
                카카오톡으로 공유하기
            </button>   
        </div>
    );
}

export default KakaoShareButton;
