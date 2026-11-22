import { useState, useRef } from "react";
import type { SubmitEvent } from "react";

export default function Contact() {
  // 入力された値の管理
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // エラーメッセージの管理
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [messageError, setMessageError] = useState("");

  // 送信中の状態を管理
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // メールアドレスの参照を取得するためのref
  const emailRef = useRef<HTMLInputElement>(null);

  // エラーメッセージを設定する処理
  //   名前の入力check
  const validateName = () => {
    if (name.trim() === "") {
      setNameError("お名前は必須です。");
      return false;
    } else if (name.length > 30) {
      setNameError("名前は30文字以内で入力してください");
      return false;
    } else {
      setNameError("");
      return true;
    }
  };
  //メールの入力check
  const validateEmail = () => {
    if (email.trim() === "") {
      setEmailError("メールアドレスは必須です。");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };
  //本文の入力check
  const validateMessage = () => {
    if (message.trim() === "") {
      setMessageError("本文は必須です。");
      return false;
    } else if (message.length > 500) {
      setMessageError("本文は500文字以内で入力してください。");
      return false;
    } else {
      setMessageError("");
      return true;
    }
  };

  // フォーム送信時の処理
  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    // ブラウザ標準のフォーム送信を防ぎ、独自の送信処理を行う（バリデーションを実行するために）
    event.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();

    // メールアドレスが入力されている場合だけ形式をチェック
    let isEmailFormatValid = true;
    // メール入力欄が空白ではないのならreportValidity()を実行する
    // メールの形式が問題なければtrue、間違っていればfalseを返す
    if (email.trim() !== "") {
      isEmailFormatValid = emailRef.current?.reportValidity() ?? false;
    }

    // どれか1つでもバリデーションエラーがある場合は送信処理を中断する
    if (
      !isNameValid ||
      !isEmailValid ||
      !isMessageValid ||
      !isEmailFormatValid
    ) {
      // エラーがある場合には、今実行しているhandleSubmitを
      // その場で終了し送信できないようにする
      return;
    }

    // APIに送信するデータを一つのオブジェクトにまとめる
    const body = {
      // プロパティ名: 値
      name: name,
      email: email,
      message: message
    };

    // バリデーションを通過したため、送信中の状態に変更する
    setIsSubmitting(true);
    // 前回の送信エラーメッセージを消去する
    setSubmitError("");

    //APIへ入力データを送る
    try {
      const response = await fetch(
        "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      //APIからの応答が正常でなければエラーを発生させる→catchへ
      if (!response.ok) {
        throw new Error("送信に失敗しました");
      }

      //送信成功時に通知し、フォームをクリアする
      alert("送信しました。");
      // 送信後にフォームをクリアする
      handleClear();

    } catch (error) {
      // 送信に失敗した場合、エラーメッセージをstateに保存する
      setSubmitError("送信中にエラーが発生しました。もう一度お試しください。");

    } finally {
      // 成功・失敗にかかわらず送信中の状態を解除する
      setIsSubmitting(false);
    }
  };


  // クリアボタンを押したときに入力欄とエラーメッセージをリセットする処理
  const handleClear = () => {
    setName("");
    setEmail("");
    setMessage("");

    setNameError("");
    setEmailError("");
    setMessageError("");

    setSubmitError("");
  };

  //画面表示部分のコーディング
  return (
    <main className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-4">
        問い合わせフォーム
      </h1>

      {/* フォーム送信時にhandleSubmitを実行し、
            ブラウザ標準の自動バリデーションを無効にする */}
      <form onSubmit={handleSubmit} noValidate>
        {/* 名前記入欄 */}
        <div className="flex items-start gap-6 mb-6">
          <label htmlFor="name" className="w-48 shrink-0 pt-3">
            お名前
          </label>

          <div className="flex-1">
            {/*
                            id：入力欄を識別し、labelのhtmlForと紐づける
                            value：useStateで管理しているnameの値を入力欄に表示する
                            onChange：入力内容が変わるたびにsetNameでstateを更新する
                            disabled：送信中（isSubmittingがtrue）は入力欄を操作できなくする
                        */}
            <input type="text"
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-md p-3"
            />
            {nameError && (
              <p className="text-red-500">
                {nameError}
              </p>
            )}
          </div>
        </div>

        {/* メールアドレス入力欄 */}
        <div className="flex items-start gap-6 mb-6">
          <label htmlFor="email" className="w-48 shrink-0 pt-3">
            メールアドレス
          </label>

          <div className="flex-1 min-w-0">
            <input
              // useRefとつなぐ
              ref={emailRef}
              type="email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-md p-3"
            />
            {emailError && (
              <p className="text-red-500">
                {emailError}
              </p>
            )}
          </div>
        </div>

        {/* 本文入力欄 */}
        <div className="flex items-center gap-6 mb-6">
          <label htmlFor="message" className="w-48 shrink-0">
            本文
          </label>

          <div className="flex-1 min-w-0">
            <textarea
              id="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-md p-3 h-48"
            />
            {messageError && <p className="text-red-500">{messageError}</p>}
          </div>
        </div>

        {/* 送信、クリアボタン */}
        <div className="flex justify-center gap-4 mt-10">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gray-700 text-white font-bold px-6 py-3 rounded-md disabled:opacity-50"
          >
            {/* 条件？trueの場合：falseの場合 */}
            {isSubmitting ? "送信中..." : "送信"}
          </button>

          <button type="button"
            onClick={handleClear}
            disabled={isSubmitting}
            className="bg-gray-200 text-black px-6 py-3 rounded-md disabled:opacity-50"
          >
            クリア
          </button>
        </div>

        {submitError && (
          <p className="text-red-500" role="alert">
            {submitError}
          </p>
        )}

      </form>
    </main>
  )
}