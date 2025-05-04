"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { FiArrowLeft, FiPhone } from "react-icons/fi";
import { AiOutlineMail } from "react-icons/ai";

export default function ContactInfoPage() {
  const { user_id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const phone = searchParams.get("phone");
  const email = searchParams.get("email");

  return (
    <div className="px-18 py-4 mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm pb-3">
        <span>Users</span>
        <span>/</span>
        <span>User{user_id}</span>
        <span>/</span>
        <span className="font-medium">Contact info</span>
      </div>

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 pb-4"
      >
        <FiArrowLeft />
        <span>Back</span>
      </button>

      {/* Contact Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Phone */}
          <div>
            <h2 className="text-sm font-semibold pb-2">Phone number</h2>
            <div className="whitespace-pre-wrap break-words bg-[#C4C4C433] p-4 rounded-lg text-[#7A7A7A] text-[12px] flex justify-between items-center">
              <p className="text-sm">{phone || "Not provided"}</p>
              <FiPhone className="ml-2 h-5 w-5 text-[#7A7A7A] flex-shrink-0" />
            </div>
          </div>

          {/* Email */}
          <div>
            <hr className="border-t-2 border-gray-200 py-4 relative top-5" />
            <h2 className="text-sm font-semibold py-2">Email</h2>
            <div className="whitespace-pre-wrap break-words bg-[#C4C4C433] p-4 rounded-lg text-[#7A7A7A] text-[12px] flex justify-between items-center">
              <p className="text-sm">{email || "Not provided"}</p>
              <AiOutlineMail className="ml-2 h-5 w-5 text-[#7A7A7A] flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
