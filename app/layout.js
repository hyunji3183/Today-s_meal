import Head from './Head'
import './global.scss'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '오늘의 식단',
  description: '건강 관리를 원하는 사람들을 위한 식단관리 웹 사이트',
  icons: {
    icon: "/favi/favicon.ico",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <Head/>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
