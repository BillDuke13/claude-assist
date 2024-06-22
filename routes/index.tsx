import { Head } from "$fresh/runtime.ts";
import TaskManager from "../islands/TaskManager.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>ClaudeAssist - AI-Powered Assistant</title>
      </Head>
      <TaskManager />
    </>
  );
}