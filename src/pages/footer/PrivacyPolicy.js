import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/footer/PrivacyPolicy.css';

const PrivacyPolicy = () => {
    const navigate = useNavigate();
    const language = localStorage.getItem('language') || 'english';

    return (
        <>
            <img src="/images/logo-en.png" alt="logo" className="main-logo-image"
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
            />
            {language === 'english' ? (
            <div className="privacy-container">
                <div className="privacy-content">
                    <div className="privacy-title">— Privacy Policy —</div>
                    <br/>

                    <div className="privacy-notice">
                        <p>**("Sentique")** values your privacy and ensures the secure management of personal information in accordance with applicable laws and regulations. This policy explains how we collect, use, and protect your personal data.</p>
                    </div>
                    <br/>

                    <section className="privacy-section">
                        <h2>1. Personal Information We Collect</h2>
                        <ul>
                            <li className="privacy-li">Required Information: Name, Email Address, Password</li>
                            <li className="privacy-li">Optional Information: Age, Gender, Preferred Fragrance</li>
                            <li className="privacy-li">Automatically Collected Information: IP Address, Cookies, Visit History</li>
                        </ul>
                    </section>
                    <br/>

                    <section className="privacy-section">
                        <h2>2. Purpose of Collecting and Using Personal Information</h2>
                        <ul>
                            <li className="privacy-li">User Management: Identity verification, Account management, Service provision</li>
                            <li className="privacy-li">Service Enhancement: Improving user experience and optimizing services</li>
                        </ul>
                    </section>
                    <br/>

                    <section className="privacy-section">
                        <h2>3. Retention and Use Period of Personal Information</h2>
                        <ul>
                            <li className="privacy-li">Personal information is deleted immediately upon membership cancellation, except when required to be retained for a certain period under relevant laws.</li>
                        </ul>
                    </section>
                    <br/>

                    <section className="privacy-section">
                        <h2>4. Sharing of Personal Information with Third Parties</h2>
                        <ul>
                            <li className="privacy-li">We do not share your personal information with external parties unless legally required or necessary for service provision with your consent.</li>
                        </ul>
                    </section>
                    <br/>

                    <section className="privacy-section">
                        <h2>5. User Rights</h2>
                        <ul>
                            <li className="privacy-li">You may request to view, modify, or delete your personal information by contacting our customer service at (02-1234-5678).</li>
                        </ul>
                    </section>
                    <br/>

                    <section className="privacy-section">
                        <h2>6. Contact Information</h2>
                        <ul>
                            <li className="privacy-li">For inquiries related to personal information, please contact us via email at (support@sentique.com).</li>
                        </ul>
                    </section>
                    <br/>
                </div>
            </div> ) :
            <div className="privacy-container">
                <div className="privacy-content">
                    <div className="privacy-title">— 개인정보 처리방침 —</div>
                    <br/>

                    <div className="privacy-notice">
                        <p>**("Sentique")**는 사용자님의 개인정보 보호를 중요시하며, 관련 법규에 따라 개인정보를 안전하게 관리하고 있습니다. 본 방침은 사용자님의 개인정보가 어떤 방식으로 수집, 사용, 보호되는지 설명합니다.</p>
                    </div>
                    <br/>

                    <section className="privacy-section">
                        <h2>1. 수집하는 개인정보 항목</h2>
                        <ul>
                            <li className="privacy-li">필수 정보: 이름, 이메일 주소, 비밀번호</li>
                            <li className="privacy-li">선택 정보: 연령, 성별, 선호 향기 정보</li>
                            <li className="privacy-li">자동 수집 정보: 접속 IP 주소, 쿠키, 방문 일시</li>
                        </ul>
                    </section>
                    <br/>

                    <section className="privacy-section">
                        <h2>2. 개인정보의 수집 및 이용 목적</h2>
                        <ul>
                            <li className="privacy-li">회원 관리: 본인 확인, 계정 관리, 서비스 제공</li>
                            <li className="privacy-li">서비스 개선: 사용자 경험 개선 및 서비스 최적화</li>
                        </ul>
                    </section>
                    <br/>

                    <section className="privacy-section">
                        <h2>3. 개인정보의 보유 및 이용 기간</h2>
                        <ul>
                        <li className="privacy-li">회원 탈퇴 시 즉시 파기하며, 관련 법령에 따라 일정 기간 보관이 필요할 경우 보관합니다.</li>
                        </ul>
                    </section>
                    <br/>

                    <section className="privacy-section">
                        <h2>4. 개인정보의 제3자 제공</h2>
                        <ul>
                        <li className="privacy-li">원칙적으로 외부에 제공하지 않으나, 법적 요청이 있는 경우 또는 서비스 제공을 위해 필수적인 경우 동의하에 제공할 수 있습니다.</li>
                        </ul>
                    </section>
                    <br/>

                    <section className="privacy-section">
                        <h2>5. 이용자의 권리</h2>
                        <ul>
                        <li className="privacy-li">개인정보 열람, 수정, 삭제 요청이 가능하며, 고객센터(02-1234-5678)로 연락해 주시면 처리해 드립니다.</li>
                        </ul>
                    </section>
                    <br/>
                    <section className="privacy-section">
                        <h2>6. 문의처</h2>
                        <ul>
                        <li className="privacy-li">개인정보 관련 문의는 이메일(support@sentique.com)로 연락해 주세요.</li>
                        </ul>
                    </section>
                    <br/>
                </div>
            </div>}
        </>
    );
};

export default PrivacyPolicy;