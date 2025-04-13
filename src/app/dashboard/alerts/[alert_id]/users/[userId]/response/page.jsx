"use client";
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function ResponseDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  // Extract parameters
  const alertId = params.alert_id;
  const userId = params.userId;
  const classification = searchParams.get('classification');
  
  // Mock data - replace with your actual data fetching
  const responseText = "Sample response text...";

  return (
    
    <div className="px-18 py-4 mx-auto">

<div className="flex items-center gap-1 text-sm pb-3">
        <span>Alerts</span>
        <span>/</span>
        <span>Alerts list</span>
        <span>/</span>
        <span>Alert{alertId}</span>
        <span>/</span>
        <span>Impacted users</span>
        <span>/</span>
        <span>User{userId}</span>
        <span>/</span>
        <span className="font-medium">Response</span>
      </div>
     <Link 
  href={`/dashboard/alerts/${alertId}/users`}
  className="flex items-center gap-2 pb-4 cursor-default"
>
  <FiArrowLeft />
  <span>Back</span>
</Link>
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        
        <div className="space-y-6">
          <div className='flex gap-2 pb-8'>
        <div className="w-8 h-8 flex-shrink-0 ">
    <img 
      src="/T.svg"
      alt="Response icon"
      className="w-full h-full object-contain"
    />
    </div>
      <h1 className="text-xl font-bold pt-1 ">Text response</h1>
  </div>
      
  <div className="whitespace-pre-wrap break-words bg-[#C4C4C433] p-4 rounded-xl text-[#7A7A7A] text-[15px] ">
  {responseText}
        </div>
    
    <div className='flex mb-10 '>
      {classification && (
        <div className="pr-5 rounded-lg inline-flex text-[12px] pt-15">
          This response is classified as&nbsp;<span className={`
          ${classification === 'positive' 
            ? ' text-green-800' 
            : ' text-red-800'
          }`}> {classification}</span>&nbsp;by ChatGPT   <img
    src="/chatgpt.svg"
    alt="ChatGPT"
    className="w-5 h-5 " 
  />
        </div>
        
      )}
      </div>
    </div>
    </div>
    </div>
  );
}