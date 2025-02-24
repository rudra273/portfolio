const Footer = () => {
    return (
      <footer className="py-12 px-4 mt-16">
        <div className="max-w-[90%] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column - About */}
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-4 font-roboto">Rudrapratap Mohanty</h3>
              <p className="text-gray-300 font-poppins mb-4 leading-relaxed">
                Software Developer passionate about creating impactful solutions
              </p>
            </div>
  
            {/* Right Column - Contact */}
            <div className="text-center md:text-right">
              <p className="text-gray-300 font-poppins mb-2">Let's Connect</p>
              <a
                href="mailto:rudramohanty45@gmail.com"
                className="inline-block px-8 py-3 border border-gray-600 hover:border-white hover:text-white transition-all duration-300"
              >
                rudramohanty45@gmail.com
              </a>
            </div>
          </div>
  
          {/* Bottom Copyright */}
          <div className="text-center mt-12">
            <p className="text-gray-400 font-poppins text-sm mb-4">
              © {new Date().getFullYear()} Rudrapratap Mohanty • Built with passion and Next.js [AI]
            </p>
          </div>
        </div>
      </footer>
    )
  }
  
export default Footer