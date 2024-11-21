export default function Modal({open, onClose, children}) {
    return (
        <div 
   
            onClick={(e) => e.stopPropagation()}
            className={`fixed inset-0 flex justify-center items-center transition-colors ${open ? "visible bg-black/10" : "invisible"}`}
        >
            
            <div 
            className={`bg-white rounded-xl shadow p-6 ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}
            >
               {/* <button 
                onClick={(e) => e.stopPropagation()}
                onClick={onClose}
                className=" absolute top-4 right-4 p-2 text-xl text-slate-900 hover:bg-gray-50 hover:text-gray-600">
                <x />
            </button>
            */} 
            {children}
      
            </div>
            
        </div>
    )
}