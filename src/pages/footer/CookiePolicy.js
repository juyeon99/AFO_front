import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/footer/CookiePolicy.css';

const CookiePolicy = () => {
    const navigate = useNavigate();
    const language = localStorage.getItem('language') || 'english';

    return (
        <>
            <img src="/images/logo-en.png" alt="logo" className="main-logo-image"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
            />
        <div className="cookiepolicy-container">
            {language === 'english' ? (
            <div className="cookiepolicy-content">
                <div className="cookiepolicy-title">— Cookie Policy —</div>
                <br/>

                <div className="cookiepolicy-notice">
                    <p>"Sentique" uses cookies to provide a better user experience.</p>
                </div>
                <br/>

                <section className="cookiepolicy-section">
                    <h2>1. What Are Cookies?</h2>
                    <ul>
                        <li className="cookiepolicy-li">Cookies are small data files stored on your computer when you visit a website.</li>
                    </ul>
                </section>
                <br/>

                <section className="cookiepolicy-section">
                    <h2>2. Purpose of Collecting and Using Cookies</h2>
                    <ul>
                        <li className="cookiepolicy-li">Service Improvement: Analyzing user website usage patterns to provide personalized recommendations.</li>
                        <li className="cookiepolicy-li">Login Maintenance: Enabling automatic login settings.</li>
                        <li className="cookiepolicy-li">Marketing: Using cookie data to provide personalized advertisements.</li>
                    </ul>
                </section>
                <br/>

                <section className="cookiepolicy-section">
                    <h2>3. Managing Cookies</h2>
                    <ul>
                        <li className="cookiepolicy-li">Users can refuse cookie collection by changing their browser settings. However, disabling cookies may limit access to certain services.</li>
                    </ul>
                </section>
                <br/>

                <section className="cookiepolicy-section">
                    <h2>4. Cookie Storage Period</h2>
                    <ul>
                        <li className="cookiepolicy-li">Session Cookies: Automatically deleted when you log out.</li>
                        <li className="cookiepolicy-li">Persistent Cookies: Stored for a certain period and can be deleted via browser settings.</li>
                    </ul>
                </section>
            </div>) : (
            <div className="cookiepolicy-content">
                <div className="cookiepolicy-title">— 쿠키 정책 —</div>
                <br/>

                <div className="cookiepolicy-notice">
                    <p>"Sentique"은 더 나은 사용자 경험을 제공하기 위해 쿠키를 사용하고 있습니다.</p>
                </div>
                <br/>

                <section className="cookiepolicy-section">
                    <h2>1. 쿠키란? </h2>
                    <ul>
                        <li className="cookiepolicy-li">쿠키는 웹사이트 방문 시 사용자의 컴퓨터에 저장되는 작은 데이터 파일입니다.</li>
                    </ul>
                </section>
                <br/>

                <section className="cookiepolicy-section">
                    <h2>2. 개인정보의 수집 및 이용 목적</h2>
                    <ul>
                        <li className="cookiepolicy-li">서비스 개선: 사용자의 웹사이트 이용 패턴을 분석하여 맞춤형 추천을 제공합니다.</li>
                        <li className="cookiepolicy-li">로그인 유지: 자동 로그인을 위한 설정을 제공합니다.</li>
                        <li className="cookiepolicy-li">마케팅: 사용자 맞춤형 광고 제공을 위해 쿠키 데이터를 사용합니다</li>
                    </ul>
                </section>
                <br/>

                <section className="cookiepolicy-section">
                    <h2>3. 쿠키의 관리</h2>
                    <ul>
                    <li className="cookiepolicy-li">사용자는 쿠키 수집을 거부할 수 있으며, 이는 브라우저 설정에서 변경할 수 있습니다. 다만 쿠키를 거부할 경우 서비스 이용에 제한이 있을 수 있습니다.</li>
                    </ul>
                </section>
                <br/>

                <section className="cookiepolicy-section">
                    <h2>4. 쿠키의 저장 기간</h2>
                    <ul>
                    <li className="cookiepolicy-li">세션 쿠키: 로그아웃 시 자동 삭제됩니다.</li>
                    <li className="cookiepolicy-li">영구 쿠키: 일정 기간 동안 저장되며, 브라우저 설정에서 삭제할 수 있습니다.</li>
                    </ul>
                </section>
            </div>)}
        </div>
        </>
    );
};

export default CookiePolicy;
