"use client"
import { useRouter } from 'next/navigation';
import { MdDashboard, MdManageAccounts, MdAnnouncement} from "react-icons/md";
import { FaBookReader, FaBook, FaChalkboardTeacher } from "react-icons/fa";
import { TfiAnnouncement } from "react-icons/tfi";
const TeacherNav = () => {
  const router = useRouter();

  const handleClick = (e, href) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <div className="ml-5 mt-36 text-black w-56  text-xs h-fixed fixed rounded">
      <ul className="flex flex-col gap-10 p-10 ">
        <li className="cursor-pointer flex gap-2 hover:text-green-500 transition-all duration-300 ease-in-out" onClick={(e) => handleClick(e, "dashboard")}><MdDashboard className='w-5 h-5'/>Dashboard</li>
        <li className="cursor-pointer flex gap-2 hover:text-green-500 transition-all duration-300 ease-in-out" onClick={(e) => handleClick(e, "subjects")}> <FaBookReader className='w-5 h-5' />My Subjects</li>
        <li className="cursor-pointer flex gap-2 hover:text-green-500 transition-all duration-300 ease-in-out" onClick={(e) => handleClick(e, "myCourses")}> <FaBookReader className='w-5 h-5' />My course</li>
        <li className="cursor-pointer flex gap-2 hover:text-green-500 transition-all duration-300 ease-in-out" onClick={(e) => handleClick(e, "AddCourseMaterials")}> <FaBook className='w-5 h-5' /> Upload Course Materials </li>
        <li className="cursor-pointer flex gap-2 hover:text-green-500 transition-all duration-300 ease-in-out" onClick={(e) => handleClick(e, "assignments")}> <FaChalkboardTeacher className='w-5 h-5' /> Assignments</li>

        <li className="cursor-pointer flex gap-2 hover:text-green-500 transition-all duration-300 ease-in-out" onClick={(e) => handleClick(e, "publishNotice")}>  <TfiAnnouncement className='w-5 h-5' />Publish Notices</li>
        <li className="cursor-pointer flex gap-2 hover:text-green-500 transition-all duration-300 ease-in-out" onClick={(e) => handleClick(e, "addComplaints")}> <MdAnnouncement className='w-5 h-5' />Add Complaints</li>
      </ul>
    </div>
  );
};

export default TeacherNav;
