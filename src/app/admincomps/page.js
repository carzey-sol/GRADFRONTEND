"use client"
import { useRouter } from 'next/navigation';
import { MdDashboard, MdManageAccounts, MdAnnouncement} from "react-icons/md";
import { FaBookReader, FaBook, FaChalkboardTeacher } from "react-icons/fa";
import { TfiAnnouncement } from "react-icons/tfi";
const AdminSideNav = () => {
  const router = useRouter();

  const handleClick = (e, href) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <div className="ml-5 mt-36 text-black w-56  text-xs h-fixed fixed rounded">
      <ul className="flex flex-col gap-10 p-10 ">
        <li className="cursor-pointer flex gap-2 hover:text-green-500 transition-all duration-300 ease-in-out" onClick={(e) => handleClick(e, "../admincomps/dashboard")}><MdDashboard className='w-5 h-5'/>Dashboard</li>
        <li className="cursor-pointer flex gap-2 hover:text-green-500 transition-all duration-300 ease-in-out" onClick={(e) => handleClick(e, "../admincomps/manageCourses")}> <FaBookReader className='w-5 h-5' />Manage Courses</li>
        <li className="cursor-pointer flex gap-2 hover:text-green-500 transition-all duration-300 ease-in-out" onClick={(e) => handleClick(e, "../admincomps/manageSubjects")}> <FaBook className='w-5 h-5' /> Manage Subjects</li>
        <li className="cursor-pointer flex gap-2 hover:text-green-500 transition-all duration-300 ease-in-out" onClick={(e) => handleClick(e, "../admincomps/manageTeachers")}> <FaChalkboardTeacher className='w-5 h-5' /> Manage Teachers</li>
        <li className="cursor-pointer flex gap-2 hover:text-green-500 transition-all duration-300 ease-in-out" onClick={(e) => handleClick(e, "../admincomps/manageStudents")}> <MdManageAccounts className='w-5 h-5' /> Manage Students</li>
        <li className="cursor-pointer flex gap-2 hover:text-green-500 transition-all duration-300 ease-in-out" onClick={(e) => handleClick(e, "../admincomps//publishNotice")}>  <TfiAnnouncement className='w-5 h-5' />Publish Notices</li>
        <li className="cursor-pointer flex gap-2 hover:text-green-500 transition-all duration-300 ease-in-out" onClick={(e) => handleClick(e, "../admincomps//reviewComplaints")}> <MdAnnouncement className='w-5 h-5' />Complaints</li>
      </ul>
    </div>
  );
};

export default AdminSideNav;
