import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/footer/FAQ.css';

const FAQ = () => {
    const navigate = useNavigate();
    const language = localStorage.getItem('language') || 'english';

    return (
        <>
            <img src="/images/logo-en.png" alt="logo" className="main-logo-image"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
            />
            <div className="faq-container">
                {language === 'english' ? (
                <div className="faq-content">
                    <div className="faq-title">— Frequently Asked Questions —</div>
                    <br/>
                
                    <section className="faq-section">
                        <h2>1. What services does Sentique provide?</h2>
                        <ul>
                            <li className="faq-li">Sentique is a service that provides personalized fragrance recommendations. It suggests scents based on images such as space photos, outfits, or text descriptions provided by users.</li>
                        </ul>
                    </section>
                    <br/>
                
                    <section className="faq-section">
                        <h2>2. What is the difference between fragrance ingredients and perfumes?</h2>
                        <ul>
                            <li className="faq-li">Fragrance ingredients are raw materials used to create perfumes, including plant extracts, fruits, and herbs. Perfumes are the final products made by blending these ingredients.</li>
                        </ul>
                    </section>
                    <br/>
                
                    <section className="faq-section">
                        <h2>3. Can I purchase the recommended perfumes?</h2>
                        <ul>
                            <li className="faq-li">Sentique does not directly sell perfumes at the moment. However, users can browse fragrances, check detailed descriptions, and compare them to find the perfect match.</li>
                        </ul>
                    </section>
                    <br/>
                
                    <section className="faq-section">
                        <h2>4. Does using the service cost anything?</h2>
                        <ul>
                            <li className="faq-li">Sentique provides personalized fragrance recommendations for free. However, if you decide to purchase a recommended product through an external website, the cost will depend on that site’s pricing policy.</li>
                        </ul>
                    </section>
                    <br/>
                
                    <section className="faq-section">
                        <h2>5. How is my personal information protected?</h2>
                        <ul>
                            <li className="faq-li">Sentique strictly protects user privacy. Personal information is used only for personalized recommendations, and you can find more details in our Privacy Policy.</li>
                        </ul>
                    </section>
                    <br/>
                
                    <section className="faq-section">
                        <h2>6. What is the "Scent History" feature?</h2>
                        <ul>
                            <li className="faq-li">Scent History allows users to save recommended fragrances as cards, which can be shared on social media or downloaded as images for personal use.</li>
                        </ul>
                    </section>
                </div>) : (
                <div className="faq-content">
                    <div className="faq-title">— 자주 묻는 질문 —</div>
                    <br/>

                    <section className="faq-section">
                        <h2>1. Sentique 서비스는 어떤 서비스를 제공하나요?</h2>
                        <ul>
                            <li className="faq-li">Sentique은 사용자에게 맞춤형 향수를 추천하는 서비스입니다. 공간 사진, 착용 복장 등의 이미지나 사용자가 입력한 문구에 따른 맞춤형 향을 추천해드립니다.</li>
                        </ul>
                    </section>
                    <br/>

                    <section className="faq-section">
                        <h2>2. 향료와 향수의 차이점은 무엇인가요?</h2>
                        <ul>
                            <li className="faq-li">향료는 향수를 구성하는 원료로, 식물, 과일, 허브 등 다양한 원료가 사용됩니다. 향수는 이러한 향료가 조합되어 만들어지며, 완성된 제품을 의미합니다.</li>
                        </ul>
                    </section>
                    <br/>

                    <section className="faq-section">
                        <h2>3. 추천된 향수를 구매할 수 있나요?</h2>
                        <ul>
                        <li className="faq-li">현재 Sentique에서는 향수를 직접 판매하지 않지만, 각 향수들을 조회하고 상세 설명을 확인 후 자신에게 맞는 향수를 비교할 수 있습니다.</li>
                        </ul>
                    </section>
                    <br/>

                    <section className="faq-section">
                        <h2>4. 서비스 이용 시 비용이 발생하나요?</h2>
                        <ul>
                        <li className="faq-li">Sentique은 무료로 맞춤 향수 추천 서비스를 제공합니다. 다만, 추천 결과에 따라 외부 사이트에서 제품을 구매하실 경우 해당 사이트의 비용 정책을 따릅니다.</li>
                        </ul>
                    </section>
                    <br/>

                    <section className="faq-section">
                        <h2>5. 개인 정보는 어떻게 보호되나요?</h2>
                        <ul>
                        <li className="faq-li">Sentique은 사용자의 개인 정보를 철저히 보호합니다. 개인 정보는 맞춤 추천을 위해 사용되며, 자세한 내용은 개인정보 처리방침에서 확인하실 수 있습니다.</li>
                        </ul>
                    </section>
                    <br/>
                    <section className="faq-section">
                        <h2>6. 향기 히스토리란 무엇인가요?</h2>
                        <ul>
                        <li className="faq-li">향기 히스토리는 사용자가 요청해 추천 받은 향수를 카드 형식으로 저장하여 나만의 향기 카드를 SNS로 공유하거나 이미지로 저장하는 데에 활용할 수 있습니다.</li>
                        </ul>
                    </section>
                    <br/>
                </div>)}
            </div>
        </>
    );
};

export default FAQ;
