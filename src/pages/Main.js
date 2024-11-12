import '../css/Main.css'
import { NavLink } from 'react-router-dom'

function Main() {
    return (
        <>
            <div className="main-video-container">
                {/* 배경 비디오 */}
                <video className="main-background-video" src="/videos/main.mp4" autoPlay muted loop></video>

                {/* 오버레이 콘텐츠 */}
                <div className="main-content">
                    <h1>"일상에 자연스럽게 스며드는 향기, 당신의 순간을 향기로 완성하세요."</h1>
                    <NavLink to="/chat">
                    <button className="main-start-button">START ▶</button>
                    </NavLink>
                </div>
            </div>
        </>
    )
}

export default Main