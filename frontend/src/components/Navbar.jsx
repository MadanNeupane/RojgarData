const NavBar = () => {
  return (
    // Logo (image) (link to home), Jobs, Companies, Salaries, Blog, Profile (link to profile page and logout button)
    <nav className="navbar bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <img src="/logo.svg" alt="Logo" className="h-12 w-12 mr-2" />
        <span className="text-2xl font-bold">RojgarData</span>
      </div>
      <div className="flex items-center">
        <a href="/" className="mx-4 hover:text-gray-300">Jobs</a>
        <a href="/companies" className="mx-4 hover:text-gray-300">Companies</a>
        <a href="/salaries" className="mx-4 hover:text-gray-300">Salaries</a>
        <a href="/blog" className="mx-4 hover:text-gray-300">Blog</a>
        <a href="/profile" className="mx-4 hover:text-gray-300">Profile</a>
        <button
          onClick={() => {
            localStorage.clear()
            window.location.href = '/login'
          }}
          className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
export default NavBar