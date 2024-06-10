/* eslint-disable react-hooks/exhaustive-deps */
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useSessionStorage from "@/hooks/useSessionStorage";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Root() {
  const getUser = useSessionStorage("user", "get");
  const navigate = useNavigate();

  useEffect(() => {
    if (getUser) {
      navigate("/dashboard/files");
    }
  }, [getUser]);
  return (
    <main>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          success: {},
        }}
      ></Toaster>
      <main id="detail">
        <Outlet></Outlet>
      </main>
    </main>
  );
}
