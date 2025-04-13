"use client";
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import { IoSaveOutline } from "react-icons/io5";

import { GrFormEdit } from "react-icons/gr";


export default function AlertMessagePage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const handleLogin = () => {
    router.push("");
  };
  
  // Get the message from URL query parameters
//   const message = searchParams.get('message');

  return (
    <div className="px-18 py-4 mx-auto">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-sm  pb-3 ">
          <span>Alerts</span>
          <span>/</span>
          <span>Alerts list</span>
          <span>/</span>
          <span>Alert{id}</span>
          <span>/</span>
          <span>Message</span>
      </div>

 
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 cursor-pointer pb-3"
      >
        <FiArrowLeft />
        <span>Back</span>
      </button>

      {/* Message Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium pb-5">Message</h2>
        <div className="whitespace-pre-wrap break-words bg-[#C4C4C433] p-4 rounded-md text-[#7A7A7A] text-[12px]">
          {" basdfljasdl;kfja;sldkfja;sldfja;slfjafsld;fkjas;lfjfaksd;lfjkfas;ldjfal;skjfla;ksdjf;kasjd;fljasd;fjasld;fjas;lkdfj;lsjdkasl;jfkasldjfa;klsdjfklasjfl;kajsklfd;jasklfjkasdjfk;l" || "No message content available"}
        </div>
        <div className='flex gap-2 w-full pt-5'>
          <button onClick={handleLogin} className="btn-primary flex items-center justify-center gap-1 w-1/2">
          <GrFormEdit size={22} className="text-white" /> 
          <span className='text-sm font-medium'>Edit</span>
          </button>
        <button onClick={handleLogin} className="btn-primary !bg-white !text-black flex items-center justify-center gap-2 w-1/2 py-2 hover:bg-gray-50 transition-colors  shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
        <IoSaveOutline  className="text-black" />
    <span className='text-sm font-medium'>Save</span>

          </button> 
        </div>
      </div>

    </div>
  );
}