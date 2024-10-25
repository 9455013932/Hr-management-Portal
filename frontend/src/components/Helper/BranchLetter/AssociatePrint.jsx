import React from 'react'
import logo from '../../../assets/CompanyLogo.png'
import { useLocation } from 'react-router-dom'
import { useRef } from 'react'
import moment from 'moment'
const AssociatePrint = () => {
  const location = useLocation()
  const { data } = location.state || {}
  console.log(data)
  const printRef = useRef()
  const handlePrint = async () => {
    const printPage = printRef.current;
    const win = window.open('width=800px ', 'height=600px')
    win.document.write(printStyle, printPage.outerHTML)
    win.document.close()
    win.onload = () => {
      win.print()
    }
  }
  const printStyle = `
  <style>
  @media print{

#header{
display:flex;
gap:3rem;
align-items:center;
border-bottom:1px groove;
padding-bottom:15px;
}

#header img{
width:250px;
}

#header .location {
    display: flex;
    flex-flow: column;
    align-items: center;

}

#header .location h1{
font-size:1.5rem;
font-weight:bold;
color:magenta;
text-shadow:1px 2px 2px #ddd;

}

#header .location P {
    font-size: .8rem;
    font-weight: 500;
    white-space: nowrap;
    margin: 0;
}
#associatePrint .time {
    display: flex;
    padding: 0 2rem;
    margin-top: 1.3rem;
    align-items: center;
    justify-content: space-between;
}
#associatePrint .time p{
    font-size: .9rem;
    margin:0;
}
    #associatePrint .h1{
   margin-top: 1.3rem; 
}
#associatePrint .h1 h1{
    text-align: center;
}



#associatePrint .detail{
    padding: 0 2rem;

}
#associatePrint .detail .sub-detail{
 display: flex;
align-items: center;
justify-content: space-between;
}
#associatePrint .detail .sub-detail .text-details{
  display: flex;
  align-items: center;
   }



  }
  </style>
  `
  return (

    <div className='p-5 '>
      {
        data && (
          <div id='associatePrint' className=' mx-auto ' ref={printRef} >

            <div id='header' className='border-b-2  pb-2 flex items-center justify-around gap-[2rem]'>
              <div className='img max-w-52'>
                <img src={logo} alt="" className='object-contain' />
              </div>

              <div className=' flex items-center flex-col location me-4'>
                <h1 className='text-[1.6rem] font-bold text-white pb-2' style={{ textShadow: '1px 2px 2px black' }}>PURODHA INFRA BUILD LLP</h1>
                <p className='text-[0.8rem] font-semibold'>Office :21 - 117/477 P Block Kakadev Kanpur UP-208025</p>
                <p className='text-[0.8rem] font-semibold md:whitespace-nowrap'>Website: www.onlinepurodha.com Contact.: 05123138729 Email:purodha.cmd@gmail.com</p>
              </div>
            </div>

            <div className='flex px-8 items-center justify-between mt-5 time'>
              <p className='text-md'>PURODHA/WELCOME</p>
              <p className='text-md'>{moment(new Date()).format('ll')}</p>
            </div>

            <div className='mt-2 h1'>
              <h1 className='text-center font-bold text-xl'>Welcome Letter</h1>
            </div>


            {/* div data start */}
            <div className='px-10 detail'>

              <div className='flex items-center justify-between sub-detail'>

                <div className='flex items-center  text-details '>
                  <div className='w-44 text-left'> <p className='font-semibold'>Referral ID :</p></div>
                  <div ><p>{data.IntrodCode}</p></div>
                </div>

                <div className='flex items-center text-details '>
                  <div className='w-40 text-left'> <p className='font-semibold'>Date of Joining : </p></div>
                  <div className='w-36'><p>{moment(data.JoinDate).format('ll')}</p></div>
                </div>
              </div>

              <div className='flex items-center justify-between sub-detail'>
                <div className='flex items-center text-details '>
                  <div className='w-44 text-left'> <p className='font-semibold'>Sponser ID : </p></div>
                  <div> <p>...</p></div>
                </div>

                <div className='flex items-center  text-details '>
                  <div className='w-40 text-left'> <p className='font-semibold'>Designation : </p></div>
                  <div className='w-36'> <p>{data.designation}</p></div>
                </div>
              </div>

              <div className='flex items-center justify-between sub-detail'>
                <div className='flex items-center  text-details '>
                  <div className='w-44 text-left'> <p className='font-semibold'>User ID : </p></div>
                  <div> <p>{data.C_Id}</p></div>
                </div>

                <div className='flex items-center  text-details '>
                  <div className='w-40 text-left'> <p className='font-semibold'>Password :</p></div>
                  <div className='w-36'> <p></p></div>
                </div>
              </div>

              <div className='flex items-center justify-between sub-detail'>
                <div className='flex items-center  text-details '>
                  <div className='w-44 text-left'> <p className='font-semibold'>Name : </p></div>
                  <div> <p>{data.Appliname}</p></div>
                </div>

                <div className='flex items-center  text-details '>
                  <div className='w-40 text-left'> <p className='font-semibold'>Date Of Birth :</p></div>
                  <div className='w-36'> <p>{data.DOB}</p></div>
                </div>
              </div>

              <div className='flex items-center justify-between sub-detail'>
                <div className='flex items-center text-details '>
                  <div className='w-44 text-left'> <p className='font-semibold'>Father/Husband Name :</p></div>
                  <div> <p>{data.FaHuName}</p></div>
                </div>

              </div>
              <div className='flex items-center justify-between sub-detail'>
                <div className='flex items-center text-details '>
                  <div className='w-44 text-left'> <p className='font-semibold'>Address :</p></div>
                  <div> <p>{data.Address}</p></div>
                </div>

              </div>

              <div className='flex items-center justify-between sub-detail'>
                <div className='flex items-center  text-details '>
                  <div className='w-44 text-left'> <p className='font-semibold'>City : </p></div>
                  <div> <p>{data.district}</p></div>
                </div>

                <div className='flex items-center  text-details '>
                  <div className='w-40 text-left'> <p className='font-semibold'>Pincode :</p></div>
                  <div className='w-36'> <p>{data.PinCode}</p></div>
                </div>
              </div>

              <div className='flex items-center justify-between sub-detail'>
                <div className='flex items-center  text-details '>
                  <div className='w-44 text-left'> <p className='font-semibold'>State : </p></div>
                  <div> <p>{data.state}</p></div>
                </div>

                <div className='flex items-center  text-details '>
                  <div className='w-40 text-left'> <p className='font-semibold'>Mobile No :</p></div>
                  <div className='w-36'> <p>{data.Mobile}</p></div>
                </div>
              </div>

            </div>
            {/* div data end */}
            {/* paragraph start */}
            <div className='dear mt-4 px-8 flex flex-col gap-2'>
              <h1 className='font-bold uppercase'>DEAR {data.Appliname}</h1>

              <p className='font-sans text-[.9rem] text-justify'>We welcome you from the bottom of our heart to the <b>"PURODHA INFRA BUILD LLP"</b> and Congratulations for
                becoming a part of ODH family.
              </p>

              <p className='font-sans text-[.9rem] text-justify'>
                <b> "PURODHA INFRA BUILD LLP"</b> has taken a great leap to give you all complete solutions to home, health, wealth
                and freedom from a single platform
              </p>

              <p className='font-sans text-[.9rem] text-justify'>
                Our aim is to provide people with a home of their dream at a reasonable cost. Our research team studied Indian
                market in great depth so that people of rural and urban areas can get access to the world's best investment in real
                estate where they can get good profits by investing in the future. We are committed in improving the standards of living
                in India and promoting inter culture influences to try and make this country a better place to live in.
              </p>

              <p className='font-sans text-[.9rem] text-justify'>
                <b> "PURODHA INFRA BUILD LLP"</b> aims to fulfill every Indian's dreams for a luxuries home. We can convert our dream
                into reality by "ODH Developers Private Limited". It is one of the best real estate company, where you can make a
                good profit by investing your money . Bring this amazing opportunity to you and invite one and all to the wonderful
                family of "ODH Developers Private Limited" to join the breathtaking journey forthwith.
              </p>

              <p className='font-sans text-[.9rem] text-justify'>
                <b> "PURODHA INFRA BUILD LLP"</b>appreciates your valuable contribution for promoting inspiring project and our unique
                Business Opportunity leading people to realize their true potential and achieve success in life.
              </p>

              <p className='font-sans text-[.9rem] text-justify'>
                We are thankful to all our Business Associates for their overwhelming response. We assure you that the confidence,
                which you all have invested in us will go a long way in consolidating our position as an innovative and entrepreneurial
                company in India
              </p>

              <p className='font-sans text-[.9rem] text-justify'>
                We look forward to creating a long-term mutually beneficial working relationship with each other.
              </p>

              <p className='font-sans text-[.9rem] text-justify'>
                Assuring you of our full co-operation in making this tie up a success for both of us and wishing you peace, prosperity
                and success ahead in life
              </p>

              <p className='font-sans text-[.9rem] text-justify'>
                We value your relationship with us and assure you of our best services always.
              </p>

              <p className='font-sans text-[.9rem]'>
                We wish you all the best.
              </p>
              <p className='font-sans text-[.9rem]'>
                <b>For "PURODHA INFRA BUILD LLP"</b>
              </p>
              <p></p>
              <p></p>
              <p></p>
              <p></p>
              <p className='font-sans text-[.9rem]'>Authorized Signatory</p>
            </div>
            {/* paragraph end */}

            <button className='border p-1 mx-auto pt-2' onClick={handlePrint}>Print</button>

          </div>
        )
      }
    </div>


  )
}

export default AssociatePrint