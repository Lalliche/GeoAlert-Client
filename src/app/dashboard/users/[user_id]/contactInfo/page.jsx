"use client";
import { useParams, useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import { AiOutlineMail } from "react-icons/ai";
import { FiPhone } from "react-icons/fi";


export default function ContactInfoPage() {
  const { user_id } = useParams();
  const router = useRouter();


  const contactInfo = {
    phone: "+213555555555",
    email: "example@gmail.com"
  };

  return (
    <div className="px-18 py-4 mx-auto">
      <div className="flex items-center gap-1 text-sm  pb-3">
        <span>Users</span>
        <span>/</span>
        <span>User{user_id}</span>
        <span>/</span>
        <span className="font-medium">Contact info</span>
      </div>

     
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 pb-4"
      >
        <FiArrowLeft />
        <span>Back</span>
      </button>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold pb-2">Phone number</h2>
          <div className='whitespace-pre-wrap break-words bg-[#C4C4C433] p-4  rounded-lg text-[#7A7A7A] text-[12px]  flex justify-between items-center'>
            <p className="text-sm">{contactInfo.phone}</p>
            <FiPhone className="ml-2 h-5 w-5 text-[#7A7A7A] flex-shrink-0" />
          </div>
          </div>
            <div>
            <hr className="border-t-2 border-gray-200 py-4 relative top-5 " />
            <h2 className="text-sm font-semibold py-2">Email</h2>
          <div className='whitespace-pre-wrap break-words bg-[#C4C4C433] p-4 rounded-lg text-[#7A7A7A] text-[12px]  flex justify-between items-center'>
            <p className="text-sm">{contactInfo.email}</p>
            <AiOutlineMail className="ml-2 h-5 w-5 text-[#7A7A7A] flex-shrink-0" />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}