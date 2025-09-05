import ZipSearch from "../components/landing/ZipSearch.jsx";

export default function Landing() {

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <main className="flex flex-col justify-center items-center min-h-screen px-4">
                <div className="max-w-2xl mx-auto text-center mb-8">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                        BarterAI
                    </h1>
                    <p className="text-xl text-gray-600 mb-2">
                        Find and trade items in your local area
                    </p>
                    <p className="text-gray-500 mb-8">
                        Discover amazing items near you and make smart trades with AI-powered matching
                    </p>
                    
                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">Local Search</h3>
                            <p className="text-sm text-gray-600">Find items in your area</p>
                        </div>
                        
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">AI Matching</h3>
                            <p className="text-sm text-gray-600">Smart item recommendations</p>
                        </div>
                        
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">Map View</h3>
                            <p className="text-sm text-gray-600">Visual location browsing</p>
                        </div>
                    </div>
                </div>
                
                <div className="w-full max-w-md">
                    <ZipSearch />
                </div>
                
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Enter your zipcode to discover items in your area
                    </p>
                </div>
            </main>
        </div>
    )
}