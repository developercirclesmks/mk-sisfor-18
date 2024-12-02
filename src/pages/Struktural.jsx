import React from 'react'
import { Link } from 'react-router-dom';

const organizationLinks = [
  { name: 'HMS FT-UH', link: '/hms-ft-uh' },
  { name: 'HMM FT-UH', link: '/hmm-ft-uh' },
  { name: 'HMDP FT-UH', link: '/hmdp-ft-uh' },
  { name: 'HME FT-UH', link: '/hme-ft-uh' },
  { name: 'HMA FT-UH', link: '/hma-ft-uh' },
  { name: 'HMG FT-UH', link: '/hmg-ft-uh' },
  { name: 'HMTI FT-UH', link: '/hmti-ft-uh' },
  { name: 'HMTK FT-UH', link: '/hmtk-ft-uh' },
  { name: 'OKSP FT-UH', link: '/oksp-ft-uh' },
  { name: 'PERMATA FT-UH', link: '/permata-ft-uh' },
  { name: 'OKIF FT-UH', link: '/okif-ft-uh' },
  { name: 'HMTL FT-UH', link: '/hmtl-ft-uh' }
]

const App = () => {
  return (
    <div className="text-center mt-10 mx-auto">
      {/* Title Section */}
      <h1 className="text-5xl font-bold text-red-700 drop-shadow-md">
        FEDERASI OKFT-UH
      </h1>

      {/* Grid Section */}
      <div className="grid grid-cols-3 gap-16 justify-center mt-5 p-10">
        {organizationLinks.map((org, index) => (
          // Using Link instead of <a> to handle navigation in React without full page reload
          <Link
            to={org.link}
            key={index}
            className="flex items-center justify-center bg-gray-500 text-white text-3xl p-6 rounded-lg shadow-lg transition-transform transform hover:bg-gray-600 hover:-translate-y-3"
          >
            {org.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default App
