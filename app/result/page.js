"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

import styles from "../../styles/Result.module.css"
import {
  LocalPrintshopOutlined,
  PictureAsPdfOutlined,
} from "@mui/icons-material"

import ScoreHeader from "../../components/score/ScoreHeader"
import Container from "../../components/Container"

const imageLink = `data:image/jpeg;base64,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`

export default function ResultPage() {
  const epsonAuthRef = useRef()

  const [authToken, setAuthToken] = useState(null)
  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    if (authToken !== null) {
      setIsConnected(true)
    }
  }, [authToken])

  const handleOpenModal = () => {
    epsonAuthRef.current.showModal()
  }

  const handleCloseModal = () => {
    epsonAuthRef.current.close()
  }

  const handleEpsonConnectAuth = async (event) => {
    event.preventDefault()

    const { email } = event.target

    const res = await fetch("/api/epson/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email.value, password: "" }),
    })

    const data = await res.json()

    if (res.ok) {
      console.log("Authenticated successfully", data)
      setAuthToken(data)
      handleCloseModal()
    } else {
      console.error("Authentication failed", data)
    }
  }

  const handlePrint = async () => {
    const image = await fetch(imageLink).then((res) => res.blob())
    const res = await fetch(`/api/epson/print/${authToken.subject_id}`, {
      method: "POST",
      headers: {
        Authorization: `${authToken.token_type} ${authToken.access_token}`,
      },
      body: image,
    })

    const data = await res.json()

    console.log(data)

    if (data["code"] != null) {
      alert(data)
    }
  }

  return (
    <div className="h-full ">
      <ScoreHeader
        className="absolute w-full z-30"
        auth={authToken}
        handleClick={handleOpenModal}
      />

      <div className="h-full flex flex-col pt-16">
        <Container>
          <h3 className="font-extrabold text-3xl">정간보 변환</h3>
          <label className="text-gray-500">
            * 현재 단소 악보 및 오선보 변환 지원
          </label>
        </Container>

        {/* 악보 */}
        <div className={styles.score_container}>
          <img src={imageLink} alt="score" className={styles.score} />
        </div>

        <div className={styles.grid}>
          <button
            className={!isConnected ? styles.disabled : styles.blue_card}
            aria-disabled={!isConnected}
            onClick={handlePrint}
          >
            <LocalPrintshopOutlined style={{ marginRight: 0.5 }} />
            프린트하기
          </button>
          <a href={imageLink} className={styles.grey_card} download>
            <PictureAsPdfOutlined />
            PDF로 저장하기
          </a>
        </div>
      </div>

      {/* 모달 */}
      <dialog
        ref={epsonAuthRef}
        className="relative bg-white backdrop:bg-black/20 backdrop:backdrop-blur-sm rounded-lg shadow"
        onClick={(event) => {
          if (event.target === epsonAuthRef.current) {
            handleCloseModal()
          }
        }}
      >
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
          <h3 className="text-xl font-semibold text-blue-800">EPSON CONNECT</h3>
          <button
            type="button"
            className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            onClick={handleCloseModal}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <div className="py-5 px-8 flex flex-wrap">
          <form className="w-80" onSubmit={handleEpsonConnectAuth}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Epson 제품에 연결된 이메일 ID
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="name@print.epsonconnect.com"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-7 mb-12 text-white bg-blue-600 active:bg-blue-700 active:after:bg-blue-600 focus:ring-4 focus:outline-none font-medium rounded-lg text-md px-5 py-2.5 text-center"
            >
              인증
            </button>
            <div className="text-sm font-medium text-center text-gray-500">
              미등록 제품인가요?{" "}
              <a
                href="https://www.epsonconnect.com/guide/ko/html/p01.htm"
                target="_blank"
                className="text-blue-500 hover:underline"
              >
                Epson Connect 계정 연동
              </a>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  )
}
