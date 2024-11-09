import { FaRegStar } from "react-icons/fa";
import { IoPricetags, IoSettingsSharp } from "react-icons/io5";
import { BsStopwatch } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
const Dashboard_Analytics = ({ analytics }) => {
  const {
    title,
    clubMail,
    roomNumber,
    needsBudget,
    guestPassesCount,
    feedback,
    description,
    date,
    budgetDetails,
    budget,
    additionalRequirements,
  } = analytics;
  return (
    <div
      data-aos="fade-up"
      data-aos-duration="2000"
      className="sm: p-4 sm: m-2 card bg-base-100 shadow-lg shadow-green-700/50"
    >
      <div className="border border-yellow-600  max-w-96" >
        <div className=" h-30 border border-purple-600">
          <h2 className="text-xl font-semibold">{title}</h2>
          <div className="flex justify-between mt-4">
            <div className="flex items-center gap-2">
            <IoPricetags />
              <h1>{budget}</h1>
            </div>
    
            <div className="flex items-center gap-2 font-semibold">
              <BsStopwatch className="text-xl"></BsStopwatch>
              <p>{date}</p>
            </div>
          </div>
          <br />

          <div className="flex items-center gap-2">
          <MdEmail className="text-xl"/>
            <h1 className="text-green-600 font-medium ">
              
              {clubMail}
            </h1>
          </div>
        </div>
        <div className="flex p-4">
          <div className="text-xl font-normal">
            <p> {date}</p>
          </div>
        </div>
        <hr className="border-dashed" />
      </div>
      <div className="flex items-center justify-between p-4">
        <p>
          <span className="text-yellow-700 font-extrabold text-xl">{date}</span>
          /$
        </p>
        <>
          <button className="btn btn-outline btn-accent">View Details</button>
        </>
      </div>
    </div>
  );
};

export default Dashboard_Analytics;
