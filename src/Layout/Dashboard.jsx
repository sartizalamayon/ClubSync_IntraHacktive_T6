import React from 'react';
import { CgAdd } from 'react-icons/cg';
import { FaHome, FaList } from 'react-icons/fa';
import { GiGymBag } from 'react-icons/gi';
import { MdSettingsApplications } from 'react-icons/md';
import { NavLink, Outlet } from 'react-router-dom';

const Dashboard = () => {
    const role = 'club';
    return (
        <div>
            <div className="font-poppins">
            <div className="grid grid-cols-4 gap-6 md:grid-cols-8 lg:grid-cols-12">
              <div className="col-span-4 lg:col-span-3 bg-[#4D44B5]  w-[300px] pl-11 h-screen">
                <ul className="menu space-y-5 mt-2 p-4 text-lg text-[#C1BBEB]">
                    <li className='text-center text-4xl font-semibold text-white'>
                        OCA
                    </li>
                  {/* OCA navbar */}
                  {role == "oca" && (
                    <>
                      <li>
                        <NavLink to={"/dashboard/all-trainers"}>
                          <GiGymBag /> All Trainers
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to={"/dashboard/applied-trainers"}>
                          <MdSettingsApplications /> Applied Trainers
                        </NavLink>
                      </li>
                      
                    </>
                  )}

                  {/* CLUB Navbar */}
                  {role == "club" && (
                    <>
                      <li className=''>
                        <NavLink to={"/dashboard"}>
                          {" "}
                          <FaHome className='text-3xl' /> Dashboard{" "}
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to={"/dashboard/add-new-slot"}>
                          {" "}
                          <CgAdd /> Add New Slot{" "}
                        </NavLink>
                      </li>
                      
                    </>
                  )}
                 
                  

                  <div className="divider"></div>

                  <li>
                    <NavLink to={"/"}>
                      <FaHome />
                      Home
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={"/classes"}>
                      <FaList />
                      Classes
                    </NavLink>
                  </li>
                  
                </ul>
              </div>
              <div className="col-span-4 lg:col-span-9 p-[50px]">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
    );
};

export default Dashboard;