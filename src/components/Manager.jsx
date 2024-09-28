import React, { useRef, useEffect, useState } from 'react';

import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import{ v4 as uuidv4 } from 'uuid';

const Manager = () => {
  const passwordRef = useRef()
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);

  const getPasswords = async () =>{
    let req =await fetch("http://localhost:3000")
    let passwords = await req.json()
    console.log(passwords)
    setPasswordArray(passwords);
  }

  useEffect(() => {
    getPasswords()
  }, []);

  const copyText = (text) => {
    toast('Copied to Clipboard', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    navigator.clipboard.writeText(text)
  }

  const showPassword = () => {
    passwordRef.current.type = "text"
  };

  const savePassword = async () => {
    if(form.site.length && form.site.username && form.site.password > 3){

      await fetch("http://localhost:3000/", {method: "DELETE", headers : {"Content-Type": "application/json"},
        body: JSON.stringify({id: form.id})})

      setPasswordArray([...passwordArray, {...form, id: uuidv4()}]);
      await fetch("http://localhost:3000/", {method: "POST", headers : {"Content-Type": "application/json"},
      body: JSON.stringify({ ...form, id: uuidv4() })})
      // localStorage.setItem('passwords', JSON.stringify([...passwordArray, {...form, id: uuidv4()}]));
      // console.log(...passwordArray, form);
      setform({site: "", username: "", password: ""})
    }
    else{
      toast('Password not saved! ');
    }
  };

  const deletePassword = async(id) => {
    let c = confirm("Do you really want to delete your password? ");
    if(c){

      console.log("Deleting Password with id", id)
      
      let res = await fetch("http://localhost:3000/", {method: "DELETE", headers : {"Content-Type": "application/json"},
        body: JSON.stringify({id})})
      // setPasswordArray(passwordArray.filter(item=>item.id !== id));
      // localStorage.setItem('passwords', JSON.stringify(passwordArray.filter(item=>item.id !== id)));

    }
  };

  const editPassword = (id) => {
    console.log("Editing Password with id", id)
    setform({...passwordArray.filter(i=>i.id===id)[0], id : id})
    setPasswordArray(passwordArray.filter(item=>item.id !== id));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>

      <ToastContainer
        position='"top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
        transition='Bounce'
      >

      </ToastContainer  >
      <div className="absolute top-0 -z-10 h-full w-full bg-white">
        <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] 
        -translate-x-[30%] translate-y-[20%] 
        rounded-full bg-[rgba(173,109,244,0.5)] opacity-50 blur-[80px]">
        </div>
      </div>
      <div className="p-2 md:p-0 md:mycontainer min-h-[88.2vh]">
        <h1 className="text-4xl text font-bold text-center  ">
          <span className='text-green-700'> &lt; </span>
          <span>Pass</span>
          <span className='text-green-700'>OP/&gt; </span>
        </h1>
        <p className='text-green-800 text-lg text-center'>Your Password Manager</p>
        <div className='flex flex-col p-4 text-black gap-8 items-center'>
          <input value={form.site} onChange={handleChange} placeholder="Enter Website URL " className="rounded-full border border-green-500 w-full p-4 py-1"
            type="text" name="site" id="site" />
          <div className="flex flex-col md:flex-row w-full justify-between gap-8">
            <input value={form.username} onChange={handleChange} placeholder="Enter Username" className="rounded-full border border-green-500 w-full p-4 py-1"
              type="text" name="username" id="username" />
            <div className="relative">
              <input value={form.password} onChange={handleChange} placeholder="Enter Password" className="rounded-full border border-green-500 w-full p-4 py-1"
                type="password" name="password" id="password" />
              <span className='absolute right-[3px] top-[4px]' onClick={showPassword}>
                <img className="p-1" width={26} src="public/icons/eye.jpg" alt="eye" />
              </span>
            </div>
          </div>
          <button onClick={savePassword} className='flex text-white justify-center items-center bg-green-500 hover:bg-green-300 rounded-full
            border-2 border-green-900 px-2 py-1 w-fit'>
            <lord-icon
              src="https://cdn.lordicon.com/jgnvfzqg.json"
              trigger="hover">
            </lord-icon>
            Add Password
          </button>
        </div>
        <div className="passwords">
          <h2 className='font-bold text-2xl py-2 '>Your Passwords</h2>
          {passwordArray.length === 0 && <div>No Passwords to Show</div>}
          {passwordArray.length != 0 && <table className="table-auto w-full rounded-md overflow-hidden mb-10">
            <thead className='bg-green-800 ext-white'>
              <tr>
                <th className='py-2'>Site</th>
                <th className='py-2'>Username</th>
                <th className='py-2'>Password</th>
                <th className='py-2'>Actions</th>
              </tr>
            </thead>
            <tbody className='bg-green-100'>
              {passwordArray.map((item, index) => {
                return <tr key={index}>
                  <td className='text-center border border-white'>
                    <span>{item.site}</span>
                    <div className=' flex items-center justify-center '>
                      <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.site) }}>
                        <lord-icon
                          style={{ "width": "25px", "height": "25px", }}
                          src="https://cdn.lordicon.com/iykgtsbt.json"
                          trigger="hover">
                        </lord-icon>
                      </div>
                    </div>
                  </td >
                  <td className='text-center border border-white'>
                    <span>{item.username}</span>
                    <div className=' flex justify-center items-center'>
                      <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.username) }}>
                        <lord-icon
                          style={{ "width": "25px", "height": "25px", }}
                          src="https://cdn.lordicon.com/iykgtsbt.json"
                          trigger="hover">
                        </lord-icon>
                      </div>
                    </div>
                  </td >
                  <td className=' text-center border border-white'>
                    <span>{"*".repeat(item.password.length)}</span>
                    <div className='flex justify-center items-center'>
                      <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.password) }}>
                        <lord-icon
                          style={{ "width": "25px", "height": "25px", }}
                          src="https://cdn.lordicon.com/iykgtsbt.json"
                          trigger="hover">
                        </lord-icon>
                      </div>
                    </div>
                  </td >
                  <td className=' text-center border border-white'>
                    <span className='cursor-pointer' onClick={()=>{editPassword(item.id)}}>
                      <lord-icon
                        src="https://cdn.lordicon.com/gwlusjdu.json"
                        trigger="hover"
                        style={{"width":"25px", "height":"25px"}}>
                      </lord-icon>
                    </span>
                    <span className='cursor-pointer' onClick={()=>{deletePassword(item.id)}}>
                      <lord-icon
                        src="https://cdn.lordicon.com/skkahier.json"
                        trigger="hover"
                        style={{"width":"25px", "height":"25px"}}>
                      </lord-icon>
                    </span>
                  </td >

                </tr>
              })}
            </tbody>
          </table>}
        </div>
      </div>
    </>
  );
};

export default Manager;
