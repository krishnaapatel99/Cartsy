'use client';
export const dynamic = "force-dynamic";
export default function ProfileCreatedPage() {
 

  return (
    <div className="min-h-screen bg-[#E5E5DD] flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="48" 
                height="48" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#10B981" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Logged In Successfully!
          </h1>
          <p className="text-gray-600 mb-6">
            You can now enjoy all the features of Urban Cartz.
          </p>
          <p 
           
            className="w-full  text-black font-medium py-2 px-4 "
          >
            You can go back to Main Window
          </p>
        </div>
      </div>
    </div>
  );
}