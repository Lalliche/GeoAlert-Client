import Header from "@/Components/Global/Header";
import SideBar from "@/Components/Global/SideBar";

export default function Layout({ children }) {
  return (
    <div className="w-full min-h-screen flex flex-row  ">
      {/* Sidebar - Always Visible */}
      <div className="sticky min-w-[20%] h-screen top-0 left-0 bg-white shadow-md">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="w-full flex flex-col max-w-[80%] ">
        <div className="sticky lg:w-full  z-50 ">
          <Header />
        </div>

        {/* Page Content */}
        <main className="h-full ">{children}</main>
      </div>
    </div>
  );
}
