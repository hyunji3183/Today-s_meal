"use client"
import evaluationList from './evaluationList.module.scss'
import { useRouter } from 'next/navigation';

export default function page() {
    const nav = useRouter();

    const arrowClick = () => {
        nav.push('/pages/list/mainList')
    }
    const close = ()=>{
        nav.push('/pages/list/mainList')
    }
    return (
        <div className={evaluationList.evaluationList_wrap}>
            <header>
                <figure onClick={arrowClick}><img src='/arrow_left.png' alt='뒤로가기' /></figure>
                <p>평가한 사람 보기</p>
            </header>

            <div className={evaluationList.evaluationList_list}>
                <ul>
                    <li>
                        <figure><img src='/member_img.png' alt=''/></figure>
                        <p>정우성님</p>
                        <div className={evaluationList.faces}>
                            <figure><img src='/1_1.png' alt=''/></figure>
                            <figure><img src='/2.png' alt=''/></figure>
                            <figure><img src='/3.png' alt=''/></figure>
                        </div>
                    </li>
                </ul>
                <button onClick={close}>닫기</button>
            </div>
        </div>
    )
}