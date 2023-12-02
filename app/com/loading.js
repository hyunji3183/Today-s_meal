import { useEffect } from 'react'

export default function Loading() {

    useEffect(() => {
        const body = document.querySelector('body')
        body.style.overflow = 'auto'
    }, [])

    return (
        <div className='Loading'>
            <div>
                <img src="/loading.png" alt='로딩이미지' className='shaking'/>
                <section className='wave'>
                    <span>L</span>
                    <span>o</span>
                    <span>a</span>
                    <span>d</span>
                    <span>i</span>
                    <span>n</span>
                    <span>g</span>
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                </section>
            </div>
        </div>
    )
}