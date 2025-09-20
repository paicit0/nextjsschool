"use client";
// npm run dev
import { useState } from "react";
import { Button } from "antd";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-row justify-center align-items-center">
        <Link href="/students">
          <Button type="primary">Students</Button>
        </Link>
        <Link href="/classrooms">
          <Button type="primary">Classrooms</Button>
        </Link>
      </div>
    </>
  );
}
